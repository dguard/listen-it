define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play/gameTemplate.html',
    'models/play/GameModel',
    'views/play/KeyboardView',
    'models/sound/SoundModel',
    'text!templates/play/melodyTemplate.html',
    'models/sound/SoundPlayerModel',
    'models/tact/TactModel'
], function($, _, Backbone, gameTemplate, GameModel, KeyboardView,
            SoundModel, melodyTemplate, SoundPlayerModel, TactModel
    ){

    var GameView = Backbone.View.extend({
        el: $("#page"),

        initialize: function(options){
            this.game = new GameModel();
            this.keyboardView = new KeyboardView();
            this.game.on('change', this.render, this);
            this.game.melody.on('change', this.render, this);
            this.game.melody.tacts.on('change', this.render, this);

            var that = this;
            this.game.melody.$whenInited.done(function(){
                that.renderMelody();
            });
            $(document).on('keydown', $.proxy(this.onPressKey, this));

            this.render();
        },

        gameTemplate: _.template(gameTemplate),

        melodyTemplate: _.template(melodyTemplate),

        events: {

            "click .game__next": "onClickNext",
            "click .game__check-tact": 'onClickCheckTact',
            "click .game__skip-tact": "onClickSkipTact",
            "click .game__play-piano": "onClickPlayPiano",
            
            "click .game__clear-key": 'onClickClearKey',
            "click .game__undo-key": 'onClickUndoKey',
            "click .game__repeat-key": 'onClickRepeatKey',

            "click .game__repeat-tact": "onClickRepeatTact",
            "click .game__melody": "onClickMelody",
            "click .piano-key": "onSelectPianoKey"
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
                    this.onClickClearKey(e);
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
        onSelectPianoKey: function(e){
            var note = $(e.currentTarget).data('note');
            var key = this.keyboardView.keyboard.keys.where({note: note})[0];
            if(this.game.canAddMark()) {
                this.game.addMark(key);
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
        render: function(){
            this.renderGame();
            this.renderMelody();
        },
        renderGame: function(){
            this.$el.find('.game').replaceWith(
                this.gameTemplate({ game: this.game })
            );
        },
        renderMelody: function(){
            this.$el.find('.melody').replaceWith(
                this.melodyTemplate({ tacts: this.game.melody.tacts.models })
            );
        }
    });

    return GameView;

});