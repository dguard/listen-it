define([
    'underscore',
    'backbone',
    'collections/tact/TactsCollection',
    'models/tact/TactModel',
    'models/sound/SoundPlayerModel'
], function(_, Backbone, TactsCollection, TactModel, SoundPlayerModel) {

    var MelodyModel = Backbone.Model.extend({

        defaults: {
            "tact_index": 0,
            "count_renders": 0
        },
        
        initialize: function(options){
            options || (options = {});
            this.soundPlayer = new SoundPlayerModel();
            var that = this;
            this.$whenInited = $.Deferred();
            this.$whenInited.promise();

            this.tacts = new TactsCollection;
            this.tacts.fetch({
                success: function () {
                    that.tacts.at(0).set('status', TactModel.STATUS_CURRENT);
                    that.$whenInited.resolve();
                }
            });
        },

        getCurrentTact: function(){
            return this.tacts.at(this.get('tact_index'));
        },

        playCurrentTact: function () {
            var tact = this.tacts.at(this.get('tact_index'));
            tact.set('status', TactModel.STATUS_CURRENT);
            this.set('count_renders', this.get('count_renders')+1);

            this.playTact();
        },

        playNextTact: function () {
            var tact = this.tacts.at(this.get('tact_index')+1);

            if (tact) {
                this.set('tact_index', this.get('tact_index')+1);
                tact.set('status', TactModel.STATUS_CURRENT);

                var prevTact = this.tacts.at(this.get('tact_index')-1);
                if(prevTact.get('status') !== TactModel.STATUS_SUCCESS) {
                    prevTact.set('status', TactModel.STATUS_ERROR);
                }
                this.set('count_renders', this.get('count_renders')+1);

                this.playTact();
            }
        },

        playMelody: function(){
            return this.soundPlayer.playTacts(this.tacts.models);
        },

        playTact: function () {
            var sounds = this.tacts.at(this.get('tact_index')).sounds;
            return this.soundPlayer.playSounds(sounds);
        }
    });

    return MelodyModel;

});
