define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play/keyTemplate.html',
    'models/play/KeyModel'
], function($, _, Backbone, keyTemplate, KeyModel){

    var KeyView = Backbone.View.extend({
        el: $("#page"),

        initialize: function(key){
            this.key = key;
            key.view = this;

            var that = this;
            this.key.on('change', function(){
                $('[data-note='+ that.key.get('note') +']').replaceWith(this.render());
            }, this);
        },

        keyTemplate: _.template(keyTemplate),

        render: function(){
            return this.keyTemplate({
                key: this.key
            });
        }
    });

    return KeyView;

});