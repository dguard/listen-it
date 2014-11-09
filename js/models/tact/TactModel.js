define([
    'underscore',
    'backbone',
    'models/sound/SoundModel'
], function(_, Backbone, SoundModel) {

    var TactModel = Backbone.Model.extend({

        initialize: function( options ) {
            this.temp = options.temp;
            this.beat = options.beat;
            this.sounds = options.sounds.map(function(){
                return new SoundModel(this);
            });
        }
    });

    return TactModel;

});