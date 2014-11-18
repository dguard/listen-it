define([
    'underscore',
    'backbone',
    'models/game/AudioManager',
    'collections/game/KeysCollection',
    'models/sound/SoundPlayerModel'
], function(_, Backbone, AudioManager, KeysCollection, SoundPlayerModel) {

    var KeyboardModel = Backbone.Model.extend({

        defaults: {
            'loaded': false
        },

        initialize: function(options) {
            options || (options = {});

            this.audioManager = AudioManager;
            this.soundPlayer = SoundPlayerModel;
            this.sustain = options.sustain || true;
            this.volume = options.volume || 1.0;

            var that = this;

            var keysCollection = new KeysCollection;
            keysCollection.fetch({ success : function() {
                that.keys = keysCollection;
                that.loadAudio();
            }});
        },

        loadAudio: function() {
            var count = this.keys.models.length,
                loaded = 0;
            var that = this;

            $.map(this.keys.models, function(pianoKey){
                that.audioManager.getAudio(pianoKey.note).done(function(audio){
                    loaded++;
                    if(loaded === count) {
                        that.set('loaded', true);
                    }
                });
            });
        }
    });

    return KeyboardModel;

});