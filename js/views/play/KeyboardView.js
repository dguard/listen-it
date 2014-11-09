define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play/keyboardTemplate.html',
    'collections/play/KeysCollection'
], function($, _, Backbone, keyboardTemplate, KeysCollection){

    var KeyboardView = Backbone.View.extend({
        el: $("#page"),

        initialize: function() {
            var that = this;

            var onDataHandler = function() {
                that.render();
            };
            this.keysCollection = new KeysCollection;
            this.keysCollection.fetch({ success : onDataHandler});
        },

        render: function(){
            var data = {
                "keys": this.keysCollection.models,
                _: _
            };
            var compiledTemplate = _.template(keyboardTemplate);
            this.$el.find('.keyboard').html(compiledTemplate(data));

            return this;
        }
    });

    return KeyboardView;

});
