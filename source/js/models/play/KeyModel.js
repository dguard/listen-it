define([
    'underscore',
    'backbone',
], function(_, Backbone) {

    var KeyModel = Backbone.Model.extend({

        defaults: {
            random: 0
        },

        initialize: function(options) {
            this.set('marks', []);
            this.note = options.note;
        },

        isWhite: function() {
            return this.note.indexOf("#") === -1;
        },

        doRender: function(){
            this.set({'random': Math.random()});
        }
    });

    return KeyModel;

});