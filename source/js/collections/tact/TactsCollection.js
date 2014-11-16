define([
    'underscore',
    'backbone',
    'models/tact/TactModel'
], function(_, Backbone, TactModel){

    var TactsCollection = Backbone.Collection.extend({
        model: TactModel,

        url : function() {
            return 'json/tactsCollection.json';
        },

        parse : function(data) {
            return data['data']['tacts'];
        }

    });

    return TactsCollection;

});