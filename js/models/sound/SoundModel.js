define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    var SoundModel = Backbone.Model.extend({

        initialize: function( options ) {
            this.sound = options.sound;
            this.duration = options.duration;
        }
    });

    return SoundModel;

});
