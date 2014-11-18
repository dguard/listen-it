define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    var SoundModel = Backbone.Model.extend({

        initialize: function( options ) {
            this.note = options.note;
            this.duration = options.duration;
        },

        getSpeed: function(){
            var parts = this.duration.split('/');
            return parts[0] / parts[1] * SoundModel.DEFAULT_DURATION;
        }
    }, {
        DEFAULT_DURATION: 7 * 2 * 100,
        DEFAULT_SPEED: 100
    });

    return SoundModel;
});
