define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/game/keyboardTemplate.html',
    'models/game/KeyboardModel',
    'views/game/KeyView'
], function($, _, Backbone, keyboardTemplate, KeyboardModel, KeyView){

    var KeyboardView = Backbone.View.extend({
        el: $("#page"),

        events: {
            "mousedown .piano-key": "clickOnPianoKey",
            "mouseup .piano-key": "upPianoKey",
            "mouseleave .piano-key": "upPianoKey",

            "touchstart .piano-key": "clickOnPianoKey",
            "touchend .piano-key": "upPianoKey"
        },

        initialize: function() {
            var that = this;

            that.keyboard = new KeyboardModel();

            that.keyboard.on('change:loaded', function(){
                _.each(that.keyboard.keys.models, function(pianoKey){
                    new KeyView(pianoKey); // link model to view
                });
                that.render();
            });
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
            $('.keyboard').replaceWith(compiledTemplate(data));

            var scrollWidth = $('.piano-key.white').length * $('.piano-key.white').outerWidth(true);
            $('.keys').width(scrollWidth);

            return this;
        },

        onKeyDown: function($key) {
            if (!$key.hasClass("down")) // Make sure it's not already pressed
            {
                $key.addClass("down");
                this.playNote($key.data("note"));
            }
        },

        playNote: function(noteName){
            this.keyboard.soundPlayer.__playNote(noteName);
        },

        onKeyUp: function($key) {
            $key.removeClass("down");
        }
    });

    return KeyboardView;

});
