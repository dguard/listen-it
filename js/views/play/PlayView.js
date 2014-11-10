define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play/playTemplate.html',
    'views/play/KeyboardView',
    'views/play/SoundPlayerView',
    'views/play/GameView',
], function($, _, Backbone, playTemplate, KeyboardView, SoundPlayerView, GameView){

    var PlayView = Backbone.View.extend({
        el: $("#page"),

        render: function(){
            this.$el.html(playTemplate);

            var keyboardView = new KeyboardView();
            var soundPlayerView = new SoundPlayerView();
            var gameView = new GameView();
        }
    });

    return PlayView;

});