define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/home/homeTemplate.html'
], function($, _, Backbone, homeTemplate){

    var HomeView = Backbone.View.extend({
        el: $("#page"),

        'events': {
            'click .btn-go-to-upload': 'onClickGoToUpload'
        },

        'onClickGoToUpload': function(){
            Backbone.history.navigate('!upload', {'trigger': true});
        },

        render: function(){
            this.$el.html(homeTemplate);
        }
    });

    return HomeView;

});