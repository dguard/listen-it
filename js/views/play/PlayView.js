define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play/playTemplate.html',
    'collections/tact/TactsCollection',
    'views/play/KeyboardView'
], function($, _, Backbone, playTemplate, TactsCollection, KeyboardView){

    var PlayView = Backbone.View.extend({
        el: $("#page"),

        render: function(){
            var tactsCollection = new TactsCollection;
            tactsCollection.fetch();

            this.$el.html(playTemplate);

            var keyboardView = new KeyboardView();
        }
    });

    return PlayView;

});