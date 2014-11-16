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
            return parts[0] / parts[1] * 7 * 100 * 2;
        }
    });

    return SoundModel;

});
