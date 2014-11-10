define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play/keyboardTemplate.html',
    'models/play/KeyboardModel'
], function($, _, Backbone, keyboardTemplate, KeyboardModel){

    var KeyboardView = Backbone.View.extend({
        el: $("#page"),

        events: {
            "mousedown .piano-key": "clickOnPianoKey",
            "mouseup .piano-key": "upPianoKey",
            "mouseleave .piano-key": "upPianoKey",
            "click .piano-key": "onSelectPianoKey"
        },

        initialize: function() {
            var that = this;
            that.keyboard = new KeyboardModel({onInit: function(){
                that.render();
            }});
        },

        clickOnPianoKey: function(e){
            this.onKeyDown($(e.currentTarget));
            return false;
        },

        upPianoKey: function(e){
            this.onKeyUp($(e.currentTarget));
            return false;
        },

        render: function(){
            var data = {
                "keys": this.keyboard.keys.models,
                _: _
            };
            var compiledTemplate = _.template(keyboardTemplate);
            this.$el.find('.keyboard').html(compiledTemplate(data));

            return this;
        },

        onKeyDown: function($key)
        {
            if (!$key.hasClass("down")) // Make sure it's not already pressed
            {
                $key.addClass("down");
                this.playNote($key.data("note"));
            }
        },

        playNote: function(noteName){
            var that = this;
            this.keyboard.audioManager.getAudio(noteName).done(function(audio){
                audio.src = audio.src; // cannot set currentTime without reloading

                $(audio).on('canplaythrough', function(){
                    audio.currentTime = 0;
                    audio.volume = that.keyboard.volume;
                    audio.play();
                });
            });
        },

        onKeyUp: function($key) {
            $key.removeClass("down");
        }
    });

    return KeyboardView;

});
