define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/result/resultTemplate.html'
], function($, _, Backbone, resultTemplate){

    var ResultView = Backbone.View.extend({
        el: $("#page"),

        render: function(){
            this.$el.html(resultTemplate);
        }
    });

    return ResultView;

});