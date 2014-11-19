define([
    'underscore',
    'backbone',
    'models/game/AudioManager',
    'collections/game/KeysCollection',
    'models/sound/SoundPlayerModel'
], function(_, Backbone, AudioManager, KeysCollection, SoundPlayerModel) {

    var KeyboardModel = Backbone.Model.extend({

        defaults: {
            'loaded': false,
            'current_octave': 2
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
        },

        detectNoteByPressedKey: function(e){
            // TODO move to json file
            var notes = {
                "83": {"note": "C#", "offset": 0},
                "68": {"note": "D#", "offset": 0},
                "71": {"note": "F#", "offset": 0},
                "72": {"note": "G#", "offset": 0},
                "74": {"note": "A#", "offset": 0},
                "76": {"note": "C#", "offset": 1},
                "186": {"note": "D#", "offset": 1},

                "90": {"note": "C", "offset": 0},
                "88": {"note": "D", "offset": 0},
                "67": {"note": "E", "offset": 0},
                "86": {"note": "F", "offset": 0},
                "66": {"note": "G", "offset": 0},
                "78": {"note": "A", "offset": 0},
                "77": {"note": "B", "offset": 0},
                "188": {"note": "C", "offset": 1},
                "190": {"note": "D", "offset": 1},
                "191": {"note": "E", "offset": 1},

                "50": {"note": "C#", "offset": 1},
                "51": {"note": "D#", "offset": 1},
                "53": {"note": "F#", "offset": 1},
                "54": {"note": "G#", "offset": 1},
                "55": {"note": "A#", "offset": 1},
                "57": {"note": "C#", "offset": 2},
                "48": {"note": "D#", "offset": 2},
                "187": {"note": "F#", "offset": 2},

                "81": {"note": "C", "offset": 1},
                "87": {"note": "D", "offset": 1},
                "69": {"note": "E", "offset": 1},
                "82": {"note": "F", "offset": 1},
                "84": {"note": "G", "offset": 1},
                "89": {"note": "A", "offset": 1},
                "85": {"note": "B", "offset": 1},
                "73": {"note": "C", "offset": 2},
                "79": {"note": "D", "offset": 2},
                "80": {"note": "E", "offset": 2},
                "219": {"note": "F", "offset": 2},
                "221": {"note": "G", "offset": 2},
                "222": {"note": "A", "offset": 3}
            };
            var note = notes[e.keyCode];
            if(note) {
                note = (this.getCurrentOctave() + note.offset) + note.note;
            }
            return note;
        },

        isChangingOctave: function(e){
            var octaves = [49, 50, 51, 52, 53, 54, 55, 56, 57, 107, 109]; // 107 = + and 109 = -
            return e.shiftKey && octaves.indexOf(e.keyCode) >= 0;
        },
        changeOctave: function(e){
            if(e.keyCode == 107) {
                octave = this.get('current_octave') + 1;
            } else if (e.keyCode == 109) {
                octave = this.get('current_octave') - 1;
            } else {
                var octaves = [49, 50, 51, 52, 53, 54, 55, 56, 57];
                var octave = octaves.indexOf(e.keyCode) + 1;
            }
            if(this.isCorrectOctave(octave)) {
                this.set('current_octave', octave);
            }
        },
        isCorrectOctave: function(octave){
            octave = octave+1; // allow play with one octave instead of two
            this.minOctave || (this.minOctave = this.keys.at(0).note[0]);
            this.maxOctave || (this.maxOctave = this.keys.at(this.keys.length-1).note[0]);
            return this.minOctave <= octave && octave <= this.maxOctave;
        },
        getCurrentOctave: function(){
            return this.get('current_octave');
        }
    });

    return KeyboardModel;

});