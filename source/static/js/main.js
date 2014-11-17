require.config({
    paths: {
        jquery: '../vendor/jquery/jquery.min',
        underscore: '../vendor/underscore/underscore.min',
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