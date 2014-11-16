define([
    'underscore',
    'backbone',
    'models/play/KeyModel'
], function(_, Backbone, KeyModel){

    var KeysCollection = Backbone.Collection.extend({
        model: KeyModel,

        url : function() {
            return 'json/keysCollection.json';
        },

        parse : function(data) {
            return data['keyboard']['keys'];
        }

    });

    return KeysCollection;

});