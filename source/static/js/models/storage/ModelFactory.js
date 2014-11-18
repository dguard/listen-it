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
            var tacts = new TactsCollection(melody.tacts);
            tacts.at(0).set('status', TactModel.STATUS_CURRENT);

            return new MelodyModel({
                tacts: tacts
            });
        }
    });

    return new ModelFactory();
});