define([
    'underscore',
    'backbone',
], function(_, Backbone) {

    var KeyModel = Backbone.Model.extend({

        defaults: {
            random: 0,
            is_pressed: false
        },

        initialize: function(options) {
            this.set('marks', []);
            this.note = options.note;
        },

        isWhite: function() {
            return this.note.indexOf("#") === -1;
        },

        isPressed: function(){
            return this.get('is_pressed');
        },

        doRender: function(){
            this.set({'random': Math.random()});
        }
    });

    return KeyModel;

});