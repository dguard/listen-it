define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play/playTemplate.html',
    'views/play/KeyboardView',
    'views/play/SoundPlayerView'
], function($, _, Backbone, playTemplate, KeyboardView, SoundPlayerView){

    var PlayView = Backbone.View.extend({
        el: $("#page"),

        render: function(){
            this.$el.html(playTemplate);

            var keyboardView = new KeyboardView();
            var soundPlayerView = new SoundPlayerView();
        }
    });

    return PlayView;

});