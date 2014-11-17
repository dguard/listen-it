define([
    'jquery',
    'underscore',
    'backbone',
    'localStorage'
], function($, _, Backbone, lc){

    return {
        save: function(app){
            var _app = {
                version: 'v0.1',
                data: {}
            };

            $.localStorage.set("app", JSON.stringify(_app));
        },
        load: function(){
            var _app = $.localStorage.get("app");

            if(!_app){
                _app = {

                };
            }
            return _app;
        }
    };
});