define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/upload/uploadTemplate.html'
], function($, _, Backbone, uploadTemplate){

    var UploadView = Backbone.View.extend({
        el: $("#page"),

        events: {
            'click #upload-file-btn': 'onClickUploadFileBtn'
        },

        onClickUploadFileBtn: function(e){
            var form_data = new FormData($('#upload-file')[0]);
            $.ajax({
                type: 'POST',
                url: '/upload',
                data: form_data,
                contentType: 'application/json',
                cache: false,
                processData: false,
                success: this.onSuccessUpload,
                error: this.onError
            });
        },

        onSuccessUpload: function(data){
            Backbone.history.navigate('!game', {'trigger': true});
        },

        onError: function(data){
            alert('Ошибка!')
        },

        render: function(){

            this.$el.html(uploadTemplate);
        }
    });

    return UploadView;

});