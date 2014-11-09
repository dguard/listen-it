define([
    'underscore',
    'backbone',
    'models/sound/SoundModel'
], function(_, Backbone, SoundModel) {

    var KeyModel = Backbone.Model.extend({

        initialize: function(options) {
            this.note = options.note;
        },

        isWhite: function() {
            return this.note.indexOf("#") === -1;
        }
    });

    return KeyModel;

});