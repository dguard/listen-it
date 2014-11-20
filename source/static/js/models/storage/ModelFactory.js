define([
    'jquery',
    'underscore',
    'backbone',
    'models/game/GameModel',
    'models/game/MelodyModel',
    'models/storage/StorageModel',
    'models/tact/TactModel',
    'collections/tact/TactsCollection'
], function($, _, Backbone, GameModel, MelodyModel, StorageModel, TactModel, TactsCollection){

    var ModelFactory = Backbone.Model.extend({

        loadGame: function(){
            return new GameModel({melody: this.loadMelody()});
        },

        loadMelody: function(){
            var melody = StorageModel.getComponent('melody');

            if(melody && melody.trackId != -1 && melody.channelId != -1 && melody.tracks) {
                var tacts = melody.tracks[melody.trackId]['channels'][melody.channelId]['tacts'];
                tacts = new TactsCollection(tacts);
                tacts.at(0).set('status', TactModel.STATUS_CURRENT);

                return new MelodyModel({
                    tacts: tacts
                });
            }
            return null;
        }
    });

    return new ModelFactory();
});