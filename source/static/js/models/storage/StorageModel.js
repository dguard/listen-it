define([
    'jquery',
    'underscore',
    'backbone',
    'localStorage'
], function($, _, Backbone, lc){

    var StorageModel = Backbone.Model.extend({

        initialize: function(){
            this.version = 'v0.11';
            this.load();
        },

        saveComponent: function(name, objValue){
            this.set(name, objValue);
            this.save();
        },

        save: function(){
            var app = {
                version: this.version,
                data: this.attributes
            };
            $.localStorage.set("app", JSON.stringify(app));
        },

        load: function(){
            var app = $.localStorage.get("app");
            if(app && app.version == this.version) {
                _.each(app.data, function(value, key){
                    this.set(key, value);
                }, this);
            }
        },

        getComponent: function(name){
            return this.get(name);
        }
    });

    return new StorageModel();
});