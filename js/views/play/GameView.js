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
], function($, _, Backbone, gameTemplate, GameModel, KeyboardView, SoundModel, melodyTemplate, SoundPlayerModel){

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
            "click .game__clear": 'onClickClearBtn',
            "click .game__undo": 'onClickUndoBtn',
            "click .game__repeat": 'onClickRepeatBtn',
            "click .game__check": 'onClickCheckBtn',
            "click .piano-key": "onSelectPianoKey",
            "click .game__next": "clickOnNextBtn",

            "click .game__repeat-tact": "clickOnRepeatBtn",
            "click .game__skip-tact": "clickOnSkipBtn",
            "click .game__melody": "clickOnMelodyBtn"
        },


        clickOnNextBtn: function(){
            if(this.game.canPlayNext()) {
                this.game.melody.playNextTact();
            } else {
                this.clickOnRepeatBtn();
            }
        },

        onPressKey: function(e){
            switch(e.keyCode) {
                case 46: // delete
                    this.onClickClearBtn(e);
                    break;
                case 37: // left
                    this.onClickUndoBtn(e);
                    break;

                case 38: // up
                    this.onClickRepeatBtn(e);
                    break;

                case 39: // right
                    this.onClickRepeatBtn(e);
                    break;

                case 40: // down
                    this.onClickUndoBtn(e);
                    break;
                case 13: // enter
                    if (event.ctrlKey) {
                        this.clickOnMelodyBtn(e);
                    } else if (event.altKey) {
                        this.onClickCheckBtn(e);
                    } else if (event.shiftKey) {
                        var sounds = this.game.getMarksAsSounds();
                        this.game.melody.soundPlayer.playSounds(sounds);
                    } else {
                        this.clickOnRepeatBtn(e);
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

        onClickClearBtn: function(e){
            this.game.clearMarks();
        },

        onClickCheckBtn: function(e){
            var tact = this.game.melody.getCurrentTact();

            if(this.game.checkMarks(tact)){
                this.game.addMessage('Отлично!');
            } else {
                this.game.addMessage('Ошибка!');
            }
        },

        onClickUndoBtn: function(e){
            this.game.undoMark();
        },

        onClickRepeatBtn: function(e){
            this.game.repeatMark();
        },

        clickOnRepeatBtn: function(){
            this.game.melody.playCurrentTact();
        },

        clickOnSkipBtn: function(){
            this.game.melody.playNextTact();
        },

        clickOnMelodyBtn: function(){
            this.game.melody.playMelody();
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