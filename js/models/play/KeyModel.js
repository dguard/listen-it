define([
    'underscore',
    'backbone',
], function(_, Backbone) {

    var KeyModel = Backbone.Model.extend({

        defaults: {
            marks: [1,2,3]
        },

        initialize: function(options) {
            this.note = options.note;
        },

        isWhite: function() {
            return this.note.indexOf("#") === -1;
        }
    });

    return KeyModel;

});