define([
    'jquery',
    'underscore',
    'backbone',
    'localStorage'
], function($, _, Backbone, lc){

    var StorageModel = Backbone.Model.extend({

        initialize: function(){
            this.load();
        },

        saveComponent: function(name, objValue){
            this.set(name, objValue);
            this.save();
        },

        save: function(){
            var app = {
                version: 'v0.1',
                data: this.attributes
            };
            $.localStorage.set("app", JSON.stringify(app));
        },

        load: function(){
            var app = $.localStorage.get("app");
            if(app) {
                _.each(app.data, function(value, key){
                    this.set(key, value);
                }, this);
                this.version = app.version;
            }
        },

        getComponent: function(name){
            return this.get(name);
        }
    });

    return new StorageModel();
});