define([
    'underscore',
    'backbone',
    'models/tact/TactModel',
    'models/play/MelodyModel',
    'models/sound/SoundModel'
], function(_, Backbone, TactModel, MelodyModel, SoundModel) {

    var GameModel = Backbone.Model.extend({

    defaults: {
        marks: [],
        history_marks: [],
        messages: []
    },

    initialize: function(options) {
        this.melody = new MelodyModel()
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
       }
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
       }
    },
    
    repeatMark: function(){
       if(this.canRepeat()) {
          var history_marks = this.get('history_marks');
          var key = history_marks.pop();
          this.addMark(key);
          this.set('history_marks', history_marks);
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
       return true;
    },

    canShowMessage: function(){
        return this.get('can_show_message');
    },

    canPlayNext: function(){
        return true;
    }
});
    return GameModel;

});