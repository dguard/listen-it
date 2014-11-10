define([
    'underscore',
    'backbone',
    'collections/tact/TactsCollection',
    'models/play/AudioManager',
    'models/tact/TactModel'
], function(_, Backbone, TactsCollection, AudioManager, TactModel) {

    var SoundPlayerModel = Backbone.Model.extend({

        "defaults": {
            "currentTactIndex": 0,
            "countOfRenders": 0
        },

        initialize: function (options) {
            options || (options = {});

            var that = this;

            this.audioManager = AudioManager;
            this.tactsCollection = new TactsCollection;
            this.tactsCollection.fetch({
                success: function () {
                    options.onInit();
                }
            });
        },

        playCurrentTact: function () {
            var tact = this.tactsCollection.at(this.get('currentTactIndex'));
            tact.set('status', TactModel.STATUS_CURRENT);
            this.set('countOfRenders', this.get('countOfRenders')+1);

            this.playTact();
        },

        playNextTact: function () {
            var tact = this.tactsCollection.at(this.get('currentTactIndex')+1);

            if (tact) {
                this.set('currentTactIndex', this.get('currentTactIndex')+1);
                tact.set('status', TactModel.STATUS_CURRENT);

                this.tactsCollection.at(this.get('currentTactIndex')-1)
                    .set('status', TactModel.STATUS_ERROR);
                this.set('countOfRenders', this.get('countOfRenders')+1);

                this.playTact();
            }
        },

        playTact: function () {
            return this.playTacts(
                [this.tactsCollection.at(this.get('currentTactIndex'))]
            );
        },

        playMelody: function(){
            return this.playTacts(this.tactsCollection.models);
        },

        playTacts: function(tacts){
            var $genDfd = $.Deferred();
            $genDfd.promise();
            var $dfd = $.Deferred();
            $dfd.promise();
            this._playTacts(tacts, 0, $dfd, $genDfd);

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

        playSounds: function(sounds, $genDfd){
            var $dfd = $.Deferred();
            $dfd.promise();
            this._playSounds(sounds, 0, $dfd, $genDfd);

            return $genDfd;
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

        _playNote: function (sound, $dfd) {
            var that = this;
            var noteName = sound.get('sound');

            that.audioManager.getAudio(noteName).done(function (audio) {
                audio.src = audio.src; // cannot set currentTime without reloading

                $(audio).bind('canplaythrough', function () {
                    audio.currentTime = 0;
                    audio.volume = 1.0;

                    setTimeout(function(){
                        $(audio).unbind('canplaythrough');
                        $dfd.resolve();
                    }, sound.getSpeed());

                    audio.play();
                });
            });
            return $dfd;
        }

    });

    return SoundPlayerModel;

});
