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
            "mouseleave .piano-key": "onEndClickPianoKey",

            "touchstart .piano-key": "onClickPianoKey",
            "touchend .piano-key": "onEndClickPianoKey"
        },

        initialize: function(options) {
            var that = this;

            // TODO refactor it
            that.game = options.game;
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
            var note = $(e.currentTarget).data('note');
            var key = this.findKeyByNote(note);

            this.pressPianoKey(key);
        },

        onEndClickPianoKey: function(e) {
            var note = $(e.currentTarget).data('note');
            var key = this.findKeyByNote(note);

            this.releasePianoKey(key);
        },

        pressPianoKey: function(key){
            if(key && !key.get('is_pressed')) {
                key.set('is_pressed', true);
                this.playNote(key.note);
                this.game.selectPianoKey(key);
            }
        },

        releasePianoKey: function(key){
            key && key.set('is_pressed', false);
        },

        playNote: function(noteName){
            this.keyboard.soundPlayer.__playNote(noteName);
        },

        onKeyDown: function(e){
            if(this.keyboard.isChangingOctave(e)) {
                this.keyboard.changeOctave(e);
                return;
            }
            var note = this.keyboard.detectNoteByPressedKey(e);
            var key = this.findKeyByNote(note);
            key && this.pressPianoKey(key);
        },
        onKeyUp: function(e){
            if(this.keyboard.isChangingOctave(e)) {
                return;
            }
            var note = this.keyboard.detectNoteByPressedKey(e);
            var key = this.findKeyByNote(note);
            key && this.releasePianoKey(key);
        },
        findKeyByNote: function(note){
            if(!note) return null;
            return this.keyboard.keys.findWhere({note: note});
        }
    });

    return KeyboardView;

});
