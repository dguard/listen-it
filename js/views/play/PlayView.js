define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play/playTemplate.html',
    'views/play/GameView'
], function($, _, Backbone, playTemplate, GameView){

    var PlayView = Backbone.View.extend({
        el: $("#page"),

        render: function(){
            this.$el.html(playTemplate);
            var gameView = new GameView();
        }
    });

    return PlayView;

});