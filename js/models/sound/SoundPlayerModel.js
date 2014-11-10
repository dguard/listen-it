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
            if (this.get('currentTactIndex') < this.tactsCollection.models.length) {
                this.set('currentTactIndex', this.get('currentTactIndex')+1);

                var tact = this.tactsCollection.at(this.get('currentTactIndex'));
                tact.set('status', TactModel.STATUS_CURRENT);

                this.tactsCollection.at(this.get('currentTactIndex')-1)
                    .set('status', TactModel.STATUS_ERROR);
                this.set('countOfRenders', this.get('countOfRenders')+1);

                this.playTact();
            }
        },

        //playTact: function () {
        //    var sounds = this.tactsCollection.models[this.get('currentTactIndex')].sounds;
        //
        //    var $dfd = $.Deferred();
        //    $dfd.promise();
        //
        //    var index = 0;
        //    this.playSound($dfd, sounds, index);
        //
        //    return $dfd;
        //},

        playMelody: function(){
            return this.playTacts(this.tactsCollection.models).done(function(){
                alert(1);
            });
        },

        playTacts: function(tacts){
            debugger;
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
                    console.log("Tact#" + index);

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
            console.log("Sound#" + index);

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
            console.log(sound.get('sound'));
            $dfd.resolve();
            return $dfd;
        }

    });

    return SoundPlayerModel;

});
