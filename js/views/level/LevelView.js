define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/level/levelTemplate.html'
], function($, _, Backbone, levelTemplate){

    var levelView = Backbone.View.extend({
        el: $("#page"),

        render: function(){
            this.$el.html(levelTemplate);
        }
    });

    return levelView;

});