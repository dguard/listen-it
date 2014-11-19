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
            "mousedown .piano-key": "onClickPianoKey",
            "mouseup .piano-key": "onEndClickPianoKey",
            "mouseleave .piano-key": "upPianoKey",

            "touchstart .piano-key": "onClickPianoKey",
            "touchend .piano-key": "onEndClickPianoKey"
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
            $(document).on('keydown', $.proxy(this.onKeyDown, this));
            $(document).on('keyup', $.proxy(this.onKeyUp, this));
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

        onClickPianoKey: function(e) {
            var $key = $(e.currentTarget);
            this.pressPianoKey($key);
        },

        onEndClickPianoKey: function(e) {
            var $key = $(e.currentTarget);
            this.releasePianoKey($key);
        },

        pressPianoKey: function($key){
            if ($key && !$key.hasClass("down")) // Make sure it's not already pressed
            {
                $key.addClass("down");
                this.playNote($key.data("note"));
            }
        },

        releasePianoKey: function($key){
            $key && $key.removeClass("down");
        },

        playNote: function(noteName){
            this.keyboard.soundPlayer.__playNote(noteName);
        },

        onKeyDown: function(e){
            if(this.keyboard.isChangingOctave(e)) {
                this.keyboard.changeOctave(e);
                return;
            }
            var note = this.keyboard.detectNoteByKey(e);
            var $key = this.findKeyByNote(note);
            $key && this.pressPianoKey($key);
        },
        onKeyUp: function(e){
            if(this.keyboard.isChangingOctave(e)) {
                return;
            }
            var note = this.keyboard.detectNoteByKey(e);
            var $key = this.findKeyByNote(note);
            $key && this.releasePianoKey($key);
        },
        findKeyByNote: function(note){
            if(!note) return null;

            var key = this.keyboard.keys.findWhere({note: note});
            if(key) {
                return $('[data-note=' + key.note + ']');
            }
            return null;
        }
    });

    return KeyboardView;

});
