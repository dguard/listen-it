define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play/playTemplate.html'
], function($, _, Backbone, playTemplate){

    var PlayView = Backbone.View.extend({
        el: $("#page"),

        render: function(){
            this.$el.html(playTemplate);
        }
    });

    return PlayView;

});