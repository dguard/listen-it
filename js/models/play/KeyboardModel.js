define([
    'underscore',
    'backbone',
    'models/play/AudioManager',
    'collections/play/KeysCollection',
], function(_, Backbone, AudioManager, KeysCollection) {

    var KeyboardModel = Backbone.Model.extend({

        initialize: function(options) {
            options || (options = {});

            this.audioManager = AudioManager;
            this.sustain = options.sustain || true;
            this.volume = options.volume || 1.0;

            var onInit = options.onInit ? options.onInit : function(){};
            var that = this;

            var keysCollection = new KeysCollection;
            keysCollection.fetch({ success : function() {
                that.keys = keysCollection;
                that.loadAudio().done(function(){
                    onInit();
                });
            }});
        },

        loadAudio: function() {
            var count = this.keys.models.length,
                loaded = 0;
            var that = this;

            var $dfd = $.Deferred();

            $.map(this.keys.models, function(pianoKey){
                that.audioManager.getAudio(pianoKey.note).done(function(audio){
                    loaded++;
                    if(loaded === count) {
                        $dfd.resolve();
                    }
                });
            });

            return $dfd.promise();
        }
    });

    return KeyboardModel;

});