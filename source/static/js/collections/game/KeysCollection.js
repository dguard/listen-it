define([
    'underscore',
    'backbone',
    'models/game/KeyModel'
], function(_, Backbone, KeyModel){

    var KeysCollection = Backbone.Collection.extend({
        model: KeyModel,

        url : function() {
            return 'json/keysCollection_3.json';
        },

        parse : function(data) {
            return data['keyboard']['keys'];
        }

    });

    return KeysCollection;

});