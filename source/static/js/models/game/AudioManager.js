"use strict";

define([
    'jquery'
], function($){
    /**
     * The audio manager provides support for loading audio files.
     * @param audioPath The default path to look for audio files
     *
     * used audioManager.js from:
     * http://www.worldtreesoftware.com/apps/examples5947/example6.3/piano.html
     */
    var AudioManager = Backbone.Model.extend({

        initialize: function( options ) {
            options || (options = {});

            this.audioPath = options.audioPath || "";
            this.audios = {};
            this.audioExt = this.getSupportedFileTypeExt();
        },

        getAudio: function(name, onError, $dfd)
        {
            $dfd || ($dfd = $.Deferred());
            name = escape(name);
            var audio = this.audios[name];
            if (!audio) {
                audio = this.createAudio(name, $dfd, onError);
                // Add to cache
                this.audios[name] = audio;
                return $dfd.promise();
            }
            else
            {
                return $dfd.resolve(audio);
            }
        },

        createAudio: function(name, $dfd, onError)
        {
            var audio = $("<audio>")[0];
            audio.addEventListener("canplaythrough", function()
            {
                $dfd.resolve(audio);
                // In firefox we keep getting these events if it's not removed
                //audio.removeEventListener("canplaythrough", arguments.callee);
            });
            audio.onerror = function()
            {
                if (onError) onError(audio);
            };
            audio.src = this.audioPath + "/" + name + this.audioExt;
            return audio;
        },

        getSupportedFileTypeExt: function()
        {
            var audio = $("<audio>")[0];
            if (audio.canPlayType("audio/ogg")) return ".ogg";
            if (audio.canPlayType("audio/mpeg")) return ".mp3";
            if (audio.canPlayType("audio/wav")) return ".wav";
            return "";
        }
    });

    return new AudioManager({"audioPath": "sounds"});
});