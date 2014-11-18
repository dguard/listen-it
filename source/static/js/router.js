// Filename: router.js
define([
    'jquery',
    'underscore',
    'backbone',
    'views/home/HomeView',
    'views/upload/UploadView',
    'views/game/GameView',
    'views/result/ResultView'
], function($, _, Backbone, HomeView, UploadView, GameView, ResultView){
    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define some URL routes
            '!upload': 'uploadFile',
            '!game': 'playGame',
            '!result': 'showResult',

            // Default
            '*actions': 'defaultAction'
        }
    });

    var initialize = function(){

        var app_router = new AppRouter;

        app_router.on('route:uploadFile', function(){
            var uploadView = new UploadView();
            uploadView.render();
        });

        app_router.on('route:playGame', function(){
            var gameView = new GameView();
        });

        app_router.on('route:showResult', function(){
            var resultView = new ResultView();
            resultView.render();
        });

        app_router.on('route:defaultAction', function (actions) {
            var homeView = new HomeView();
            homeView.render();
        });

        Backbone.history.start();
    };
    return {
        initialize: initialize
    };
});