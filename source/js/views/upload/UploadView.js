define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/upload/uploadTemplate.html'
], function($, _, Backbone, uploadTemplate){

    var UploadView = Backbone.View.extend({
        el: $("#page"),

        render: function(){
            this.$el.html(uploadTemplate);
        }
    });

    return UploadView;

});