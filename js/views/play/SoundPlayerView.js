define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/play/soundPlayerTemplate.html',
    'models/sound/SoundPlayerModel'
], function($, _, Backbone, soundPlayerTemplate, SoundPlayerModel){

    var SoundPlayerView = Backbone.View.extend({
        el: $("#page"),

        initialize: function(){
            var that = this;
            this.soundPlayerModel = new SoundPlayerModel({
                onInit: function(){
                    that.render()
                }
            });
            this.soundPlayerModel.on('change:countOfRenders', this.render, this);
            this.soundPlayerModel.tactsCollection.on('change', this.render, this);
        },

        events: {
            "click .repeat-btn": "clickOnRepeatBtn",
            "click .skip-btn": "clickOnSkipBtn",
            "click .melody-btn": "clickOnMelodyBtn"
        },

        soundPlayerTemplate: _.template(soundPlayerTemplate),

        clickOnRepeatBtn: function(){
            this.soundPlayerModel.playCurrentTact();
        },

        clickOnSkipBtn: function(){
            this.soundPlayerModel.playNextTact();
        },

        clickOnMelodyBtn: function(){
            this.soundPlayerModel.playMelody();
        },

        render: function(){
            this.$el.find('.sound-player').replaceWith(this.soundPlayerTemplate({
                tacts: this.soundPlayerModel.tactsCollection.models
            }));
        }
    });

    return SoundPlayerView;

});