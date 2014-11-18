require.config({
    paths: {
        jquery: '../vendor/jquery/jquery',
        underscore: '../vendor/underscore/underscore',
        backbone: '../vendor/backbone/backbone',
        templates: '../templates',
        localStorage: '../vendor/plugins/jquery.localStorage'
    }
});

require([
    'app'
], function(App){
    App.initialize();
});