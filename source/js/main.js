require.config({
    paths: {
        jquery: '../vendor/jquery/jquery.min',
        underscore: '../vendor/underscore/underscore.min',
        backbone: '../vendor/backbone/backbone.min',
        templates: '../templates'
    }
});

require([
    'app'
], function(App){
    App.initialize();
});