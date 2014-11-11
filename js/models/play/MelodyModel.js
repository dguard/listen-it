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

        isLastTact: function(tact){
            return this.tacts.indexOf(tact) === this.tacts.length-1;
        },

        isSolvedTact: function(tact){
            if(tact) {
                var status = tact.get('status');
                return status === TactModel.STATUS_ERROR || status === TactModel.STATUS_SUCCESS;
            }
            return false;
        },

        playCurrentTact: function () {
            var tact = this.getCurrentTact();
            this.playTact(tact);
        },

        goToNextTact: function(){
            var prevTact = this.getCurrentTact();

            if(this.get('tact_index')+1 < this.tacts.length) {
                this.set('tact_index', this.get('tact_index')+1);

                var tact = this.getCurrentTact();
                tact.set('status', TactModel.STATUS_CURRENT);

                if(prevTact.get('status') !== TactModel.STATUS_SUCCESS) {
                    prevTact.set('status', TactModel.STATUS_ERROR);
                }
                this.set('count_renders', this.get('count_renders')+1);
                return true;
            }
            return false;
        },

        playMelody: function(){
            return this.soundPlayer.playTacts(this.tacts.models);
        },

        playTact: function (tact) {
            return this.soundPlayer.playSounds(tact.sounds);
        }
    });

    return MelodyModel;

});
