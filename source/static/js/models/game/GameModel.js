define([
    'underscore',
    'backbone',
    'models/tact/TactModel',
    'models/sound/SoundModel'
], function(_, Backbone, TactModel, SoundModel) {
    var GameModel = Backbone.Model.extend({

    defaults: {
        marks: [],
        history_marks: [],
        messages: [],
        select_piano_keys: true
    },

    initialize: function(options) {
        this.melody = options.melody;
        var that = this;

        // for updating view when user goes to another page and reloads current
        setTimeout(function(){
            _.each(that.get('marks'), function(key){
                key.doRender();
            })
        }, 100);
    },

    _push: function(arg, val) {
        var arr = _.clone(this.get(arg));
        arr.push(val);
        this.set(arg, arr);
    },

    _pop: function(arg, val) {
        var arr = _.clone(this.get(arg));
        arr.push(val);
        this.set(arg, arr);
    },

    addMessage: function(message){
        this._push('messages', message);
    },

    getLastMessage: function(){
        return this.get('messages').slice(-1).pop();
    },

    clearMarks: function(){
       if(this.canClear()) {
          var marks = this.get('marks');
          _.each(marks, function(key){
             var key_marks = key.get('marks');
             key_marks.pop();
             key.set('marks', key_marks);
             key.doRender();
          });
    
          var history_marks = this.get('history_marks');
          for(var i = marks.length-1; i >= 0; i--) {
             history_marks.push(marks[i]);
          }
          this.set('history_marks', history_marks);
          this.set('marks', []);
          this.clearOnSelect = true;
          this.doRender();
       }
    },

    clearHistory: function(){
        var marks = this.get('marks');
        _.each(marks, function(key){
            key.set('marks', []);
            key.doRender();
        });
        this.set('marks', []);
        this.set('history_marks', []);
    },
    
    addMark: function(key){
       var marks = this.get('marks');
       marks.push(key);
       this.set('marks', marks);
    
       var key_marks = key.get('marks');
       key_marks.push(this.get('marks').length);
       key.set({'marks': key_marks});
       key.doRender();

       if(this.clearOnSelect) {
          this.set('history_marks', []);
       }
       this.doRender();
    },

    doRender: function(){
        this.set({'random': Math.random()});
    },
    
    undoMark: function(){
       if(this.canUndo()) {
          var marks = this.get('marks');
          var key = marks.pop();
    
          var history_marks = this.get('history_marks');
          history_marks.push(key);
          this.set('history_marks', history_marks);
    
          var key_marks = key.get('marks');
          key_marks.pop();
          key.set('marks', key_marks);
          key.doRender();

          this.set('marks', marks);
          this.doRender();
       }
    },
    
    repeatMark: function(){
       if(this.canRepeat()) {
          var history_marks = this.get('history_marks');
          var key = history_marks.pop();
          this.addMark(key);
          this.set('history_marks', history_marks);
          this.doRender();
       }
    },

    checkMarks: function(tact){
        var marks = this.get('marks');

        if(this.canCheckMarks() && tact.sounds.length === marks.length) {
            var isCompare = true;
            for(var i = 0; i < tact.sounds.length; i++) {
                if(tact.sounds[i].get('note') !== marks[i].note) {
                    isCompare = false;
                    break;
                }
            }
            if(isCompare) {
                tact.set('status', TactModel.STATUS_SUCCESS);
                return true;
            }
        }
        tact.set('status', TactModel.STATUS_ERROR);
        this.doRender();
        return false;
    },

    getMarksAsSounds: function(){
        var sounds = [];
        var marks = this.get('marks');
        for(var i = 0; i < marks.length; i++) {
            var sound = new SoundModel({'note': marks[i].get('note'), duration: '1/4'});
            if(sound) {
                sounds.push(sound);
            }
        }
        return sounds;
    },

    endGame: function(){
        var compares = 0;
        _.each(this.melody.tacts.models, function(tact){
            if(tact.get('status') === TactModel.STATUS_SUCCESS) {
                compares++;
            }
        });
        alert(
            'Здесь должен быть воодушевляющий текст...\r\n ' +
            'Но мы то знаем, что он никому не нужен!\r\n ' +
            'Я просто скажу, что ты угадал ' + compares +
            ' из ' + this.melody.tacts.models.length + '.\r\n Это очень здорово!'
        );
    },
    
    canUndo: function(){
       return this.get('marks').length > 0;
    },
    
    canRepeat: function(){
        return this.get('history_marks').length > 0;
    },
    
    canClear: function(){
        return this.get('marks').length > 0;
    },
    
    canAddMark: function(){
        return true;
    },

    canCheckMarks: function(){
        return this.get('marks').length > 0;
    },

    canShowMessage: function(){
        return this.get('can_show_message');
    },

    canPlayNext: function(compareStatus){
        compareStatus || (compareStatus = true);
        var tact = this.melody.getCurrentTact();
        return !this.melody.isLastTact(tact) && (!compareStatus || this.melody.isSolvedTact(tact));
    },

    canPlayPiano: function(){
        return this.get('marks').length > 0;
    },

    canSkipTact: function(){
        var tact = this.melody.getCurrentTact();
        return !(this.melody.isLastTact(tact) && this.melody.isSolvedTact(tact));
    },

    canEnd: function(compareStatus){
        (compareStatus === false) || (compareStatus = true);

        var tact = this.melody.getCurrentTact();
        return this.melody.isLastTact(tact) && (!compareStatus || this.melody.isSolvedTact(tact));
    }
});
    return GameModel;

});