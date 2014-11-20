define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/upload/uploadTemplate.html',
    'models/storage/StorageModel'
], function($, _, Backbone, uploadTemplate, StorageModel){

    var UploadView = Backbone.View.extend({
        el: $("#page"),

        initialize: function(){
            this.tracks = [];
            var melody = StorageModel.getComponent('melody');
            if(melody) {
                this.tracks = melody.tracks;
                this.source = melody.source;
            }
        },

        events: {
            'click #upload-file-btn': 'onClickUploadFileBtn',
            'click .channel-list__channel': 'onClickChannel'
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
                error: this.onError,
                context: this,
                beforeSend: function(){
                    $('.melody-tracks').empty();
                    $('.ajax-loader').removeClass('hide');
                }
            });
        },

        onClickChannel: function(e){
            e.preventDefault();
            var melody = StorageModel.getComponent('melody');

            if(melody) {
                var $channel = $(e.currentTarget);
                melody.trackId = $channel.closest('.track').data('track_id');
                melody.channelId = $channel.data('channel_id');

                StorageModel.saveComponent('melody', melody);
                Backbone.history.navigate('!game', {'trigger': true});
            }
        },

        onSuccessUpload: function(data){
            if(data.status == 'success') {
                StorageModel.saveComponent('melody', {
                    trackId: -1,
                    channelId: -1,
                    tracks: data.data['tracks'],
                    source: data.data['source']
                });
                this.tracks = data.data['tracks'];
                this.source = data.data['source'];

                $('.ajax-loader').addClass('hide');
                this.render();
            } else {
                // TODO обернуть в красивый вид
                alert('Ошибка при парсинге файла!');
                $('.ajax-loader').addClass('hide');
            }
        },

        onError: function(data){
            // TODO обернуть в красивый вид
            alert('Ошибка при получении данных!');
            $('.ajax-loader').addClass('hide');
        },

        render: function(){
            this.$el.html(
                _.template(uploadTemplate)({'message': StorageModel.getComponent('message'), tracks: this.tracks, source: this.source})
            );
            StorageModel.set('message', '')
        }
    });

    return UploadView;

});