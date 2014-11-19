define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/game/gameTemplate.html',
    'views/game/KeyboardView',
    'models/sound/SoundModel',
    'text!templates/game/melodyTemplate.html',
    'models/sound/SoundPlayerModel',
    'models/tact/TactModel',
    'text!templates/game/mainTemplate.html',
    'models/storage/StorageModel',
    'models/storage/ModelFactory'
], function($, _, Backbone, gameTemplate, KeyboardView,
            SoundModel, melodyTemplate, SoundPlayerModel, TactModel, mainTemplate, StorageModel, ModelFactory
    ){

    var GameView = Backbone.View.extend({
        el: $("#page"),

        initialize: function(options){
            if(!this.canStart()) {
                StorageModel.saveComponent('message', 'Выберите или загрузите midi-файл, чтобы приступить к игре');
                Backbone.history.navigate('!upload', {'trigger': true});
                return;
            }
            this.game = ModelFactory.loadGame();
            this.game.on('change', this.render, this);

            this.game.melody.on('change', this.render, this);
            this.game.melody.on('change:loaded', this.renderMelody, this);
            this.game.melody.tacts.on('change', this.render, this);

            this.keyboardView = new KeyboardView({game: this});
            $(document).on('keydown', $.proxy(this.onPressKey, this));

            this.renderMain();
            this.render();
        },

        canStart: function(){
            var melody = StorageModel.get('melody');
            return melody && melody.tacts;
        },

        gameTemplate: _.template(gameTemplate),

        melodyTemplate: _.template(melodyTemplate),

        mainTemplate: _.template(mainTemplate),

        events: {

            "click .game__next": "onClickNext",
            "click .game__check-tact": 'onClickCheckTact',
            "click .game__skip-tact": "onClickSkipTact",
            "click .game__play-piano": "onClickPlayPiano",
            
            "click .game__clear-key": 'onClickClearKey',
            "click .game__undo-key": 'onClickUndoKey',
            "click .game__repeat-key": 'onClickRepeatKey',

            "click .game__repeat-tact": "onClickRepeatTact",
            "click .game__melody": "onClickMelody"
        },


        onClickNext: function(){
            if(this.game.canEnd()) {
                this.game.endGame();
                return;
            }
            if(this.game.canPlayNext()) {
                this.game.clearHistory();
                if(this.game.melody.goToNextTact()) {
                    this.playCurrentTact();
                }
            } else {
                this.onClickRepeatTact();
            }
        },

        onClickCheckTact: function(e){
            var tact = this.game.melody.getCurrentTact();

            if(this.game.melody.getCurrentTact().get('status') === TactModel.STATUS_SUCCESS) {
                this.onClickNext();
            }
            if(this.game.checkMarks(tact)){
                this.game.addMessage({text: 'Верно!', 'status': 'success'});
            } else {
                this.game.addMessage({text: 'Вы ошиблись!', 'status': 'error'});
            }
            if(this.game.canEnd()) {
                this.game.endGame();
            }
        },

        onClickSkipTact: function(){
            if(this.game.canEnd(false)) {
                this.game.melody.getCurrentTact().set('status', TactModel.STATUS_ERROR);
                this.game.endGame();
            }
            this.game.clearHistory();
            this.game.melody.goToNextTact() && this.game.melody.playCurrentTact();
        },

        onPressKey: function(e){
            switch(e.keyCode) {
                case 46: // delete
                    if(e.shiftKey) {
                        this.game.set('select_piano_keys', !this.game.get('select_piano_keys'))
                    } else {
                        this.onClickClearKey(e);
                    }
                    break;
                case 37: // left
                    this.onClickUndoKey(e);
                    break;
                case 38: // up
                    this.onClickRepeatKey(e);
                    break;
                case 39: // right
                    this.onClickRepeatKey(e);
                    break;
                case 40: // down
                    this.onClickUndoKey(e);
                    break;
                case 13: // enter
                    if (event.ctrlKey) {
                        this.onClickMelody(e);
                    } else if (event.altKey) {
                        this.onClickCheckTact(e);
                    } else if (event.shiftKey) {
                        this.onClickPlayPiano(e);
                    } else {
                        this.onClickRepeatTact(e);
                    }
                    break;

                default: return; // exit this handler for other keys
            }
            e.preventDefault(); // prevent the default action (scroll / move caret)
        },
        selectPianoKey: function(key){
            if(this.game.get('select_piano_keys')) {
                if(this.game.canAddMark()) {
                    this.game.addMark(key);
                }
            }
        },
        onClickClearKey: function(e){
            this.game.clearMarks();
        },
        onClickUndoKey: function(e){
            this.game.undoMark();
        },
        onClickRepeatKey: function(e){
            this.game.repeatMark();
        },
        onClickRepeatTact: function(){
            this.game.melody.playCurrentTact();
        },
        onClickMelody: function(){
            this.game.melody.playMelody();
        },
        onClickPlayPiano: function(){
            var sounds = this.game.getMarksAsSounds();
            this.game.melody.soundPlayer.playSounds(sounds);
        },
        renderMain: function(){
            this.$el.html(
                this.mainTemplate()
            );
        },
        render: function(){
            this.renderGame();
            this.renderMelody();
        },
        renderGame: function(){
            $('.game').replaceWith(
                this.gameTemplate({ game: this.game })
            );
        },
        renderMelody: function(){
            $('.melody').replaceWith(
                this.melodyTemplate({ tacts: this.game.melody.tacts.models })
            );
            var $bruceLee = $('.tacts-list li');
            var scrollWidth = $bruceLee.length * $bruceLee.outerWidth(true);
            $('.tacts-list').width(scrollWidth);
        }
    });

    return GameView;

});