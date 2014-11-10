define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play/gameTemplate.html',
    'models/play/GameModel'
], function($, _, Backbone, gameTemplate, GameModel){

    var GameView = Backbone.View.extend({
        el: $("#page"),

        initialize: function(){
            this.game = new GameModel();
            this.render();
        },

        gameTemplate: _.template(gameTemplate),

        events: {
            "click .game .clear-btn": 'onClickClearBtn',
            "click .game .undo-btn": 'onClickUndoBtn',
            "click .game .repeat-btn": 'onClickRepeatBtn'
        },

        'onClickClearBtn': function(e){
            this.game.clearMarks();
        },

        'onClickUndoBtn': function(e){
            this.game.undoMark();
        },

        'onClickRepeatBtn': function(e){
            this.game.repeatMark();
        },

        render: function(){
            this.$el.find('.game').replaceWith(
                this.gameTemplate({
                    game: this.game
                })
            );
        }
    });

    return GameView;

});