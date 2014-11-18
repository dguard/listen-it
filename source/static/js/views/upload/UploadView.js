define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/upload/uploadTemplate.html',
    'models/storage/StorageModel'
], function($, _, Backbone, uploadTemplate, StorageModel){

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
                dataType: 'json',
                contentType: false,
                cache: false,
                processData: false,
                success: this.onSuccessUpload,
                error: this.onError
            });
        },

        onSuccessUpload: function(data){
            if(data.status == 'success') {
                StorageModel.saveComponent('melody', {
                    tacts: data.data['tracks'][0]['channels'][0]['tacts']
                });
                Backbone.history.navigate('!game', {'trigger': true});
            } else {
                // TODO обернуть в красивый вид
                alert('Ошибка при парсинге файла!');
            }
        },

        onError: function(data){
            // TODO обернуть в красивый вид
            alert('Ошибка при получении данных!')
        },

        render: function(){
            this.$el.html(
                _.template(uploadTemplate)({'message': StorageModel.getComponent('message')})
            );
            StorageModel.set('message', '')
        }
    });

    return UploadView;

});