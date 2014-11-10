define([
    'underscore',
    'backbone',
    'models/sound/SoundModel'
], function(_, Backbone, SoundModel) {

    var TactModel = Backbone.Model.extend({

        initialize: function( options ) {
            this.temp = options.temp;
            this.beat = options.beat;
            this.status = TactModel.STATUS_UNKNOWN;
            this.sounds = options.sounds.map(function(value, index){
                return new SoundModel(value);
            });
        },

        getStatus: function(){
            return this.get('status');
        }
    }, {
        STATUS_SUCCESS: 'success',
        STATUS_ERROR: 'error',
        STATUS_CURRENT: 'current',
        STATUS_UNKNOWN: ''
    });

    return TactModel;

});