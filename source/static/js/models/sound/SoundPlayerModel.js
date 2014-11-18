define([
    'underscore',
    'backbone',
    'collections/tact/TactsCollection',
    'models/game/AudioManager',
    'models/tact/TactModel',
    'models/sound/SoundModel'
], function(_, Backbone, TactsCollection, AudioManager, SoundModel) {

    var SoundPlayerModel = Backbone.Model.extend({

        initialize: function () {
            this.audioManager = AudioManager;
        },

        playTacts: function(tacts){
            var $genDfd = $.Deferred();
            $genDfd.promise();
            var $dfd = $.Deferred();
            $dfd.promise();
            this._playTacts(tacts, 0, $dfd, $genDfd);

            return $genDfd;
        },

        playSounds: function(sounds, $genDfd){
            $genDfd || ($genDfd = $.Deferred());
            var $dfd = $.Deferred();
            $dfd.promise();
            this._playSounds(sounds, 0, $dfd, $genDfd);

            return $genDfd;
        },

        _playTacts: function(tacts, index, $dfd, $genDfd){
            var that = this;

            $dfd.done(function(){
                if (index < tacts.length) {

                    var $newDfd = $.Deferred();
                    $newDfd.promise();
                    that._playTacts(tacts, index+1, $newDfd, $genDfd);
                }
            });
            if (index < tacts.length) {
                this.playSounds(tacts[index].sounds, $dfd);
            } else {
                $genDfd.resolve();
            }
            return $dfd;
        },

        _playSounds: function (sounds, index, $dfd, $genDfd) {
            var that = this;

            $dfd.done(function(){
                if (index < sounds.length) {
                    var $newDfd = $.Deferred();
                    $newDfd.promise();
                    that._playSounds(sounds, index+1, $newDfd, $genDfd);
                }
            });
            if (index < sounds.length) {
                that._playNote(sounds[index], $dfd);
            } else {
                $genDfd.resolve();
            }

            return $dfd;
        },

        __playNote: function(noteName, speed, $dfd){
            $dfd || ($dfd = $.Deferred());

            var $newDfd = $.Deferred();
            speed || (speed = SoundModel.DEFAULT_SPEED);
            $newDfd.done(function (audio) {
                audio.src = audio.src; // cannot set currentTime without reloading

                $(audio).bind('canplaythrough', function () {
                    audio.currentTime = 0;
                    audio.volume = 1.0;

                    setTimeout(function(){
                        $(audio).unbind('canplaythrough');
                        $dfd.resolve();
                    }, speed);

                    audio.play();
                });
            });

            this.audioManager.getAudio(noteName, function(){}, $newDfd);
            return $dfd;
        },

        _playNote: function (sound, $dfd) {
            var noteName = sound.get('note');
            var speed = sound.getSpeed();

            return this.__playNote(noteName, speed, $dfd);
        }

    });

    return new SoundPlayerModel();

});
