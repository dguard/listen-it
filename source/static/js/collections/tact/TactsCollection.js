define([
    'underscore',
    'backbone',
    'models/tact/TactModel'
], function(_, Backbone, TactModel){

    var TactsCollection = Backbone.Collection.extend({
        model: TactModel
    });

    return TactsCollection;

});