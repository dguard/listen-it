"use strict";

function PianoApp()
{
    var version = "6.3",
        audioManager = new AudioManager("audio"),
        keyCodesToNotes = {},
        sustain = true,
        volume = 1.0;

    function setStatus(message)
    {
        $("#app footer").text(message);
    }

    function loadAudio()
    {
        var count = 0,
            loaded = 0,
            error = false;

        $(".keyboard .piano-key").each(function()
        {
            count++;
            var noteName = escape($(this).data("note"));
            audioManager.getAudio(noteName,
                function()
                {
                    if (error) return;
                    if (++loaded == count) setStatus("Ready.");
                    else setStatus("Loading " + Math.floor(100 * loaded / count) + "%");
                },
                function(audio)
                {
                    error = true;
                    setStatus("Error loading: " + audio.src);
                }
            );
        });
    }

    function initKeyboard()
    {
        var $keys = $(".keyboard .piano-key");
        if ($.isTouchSupported)
        {
            $keys.touchstart(function(e) {
                e.stopPropagation();
                e.preventDefault();
                keyDown($(this));
            })
                .touchend(function() { keyUp($(this)); })
        }
        else
        {
            $keys.mousedown(function() {
                keyDown($(this));
                return false;
            })
                .mouseup(function() { keyUp($(this)); })
                .mouseleave(function() { keyUp($(this)); });
        }

        // Create mapping of key codes to notes
        $keys.each(function() {
            var $key = $(this);
            var keyCode = keyCodes[$key.data("keycode")];
            keyCodesToNotes[keyCode] = $key.data("note");
        });
    }

    function keyDown($key)
    {
        // Make sure it's not already pressed
        if (!$key.hasClass("down"))
        {
            $key.addClass("down");
            var noteName = $key.data("note");
            var audio = audioManager.getAudio(escape(noteName));
            audio.currentTime = 0;
            audio.volume = volume;
            audio.play();
        }
    }

    function keyUp($key)
    {
        $key.removeClass("down");
        if (!sustain)
        {
            var noteName = $key.data("note");
            var audio = audioManager.getAudio(escape(noteName));
            audio.pause();
        }
    }

    function onKeyDown(e)
    {
        var note = keyCodesToNotes[e.which];
        if (note)
        {
            pressPianoKey(note);
        }
    }

    function onKeyUp(e)
    {
        var note = keyCodesToNotes[e.which];
        if (note)
        {
            releasePianoKey(note);
        }
    }

    function pressPianoKey(note)
    {
        var $key = getPianoKeyElement(note);
        keyDown($key);
    }

    function releasePianoKey(note)
    {
        var $key = getPianoKeyElement(note);
        keyUp($key);
    }

    function getPianoKeyElement(note)
    {
        return $(".keyboard .piano-key[data-note=" + note + "]");
    }

    function isInputTypeSupported(type)
    {
        var $test = $("<input>");
        // Set input element to the type we're testing for
        $test.attr("type", type);
        return ($test[0].type == type);
    }

    this.start = function()
    {
        $("#app header").append(version);
        setStatus("Loading...");

        loadAudio();
        initKeyboard();

        $("#sustain").change(function() { sustain = $(this).is(":checked"); });
        $("#volume").change(function() { volume = parseInt($(this).val()) / 100; });
        if (!isInputTypeSupported("range")) $("#volume").css("width", "3em");

        $(document).keydown(onKeyDown)
            .keyup(onKeyUp);
    };
}

$(function()
{
    window.app = new PianoApp();
    window.app.start();
});