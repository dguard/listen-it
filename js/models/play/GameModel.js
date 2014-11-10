define([
    'underscore',
    'backbone',
], function(_, Backbone) {

    var GameModel = Backbone.Model.extend({

        defaults: {
            marks: [],
            history_marks: []
        },

        initialize: function(options) {
        },

        clearMarks: function(){
            if(this.canClear()) {
                this.set('history_marks', this.get('history_marks').concat(this.get('marks')));
                this.set('marks', []);
            }
        },

        undoMark: function(){
            if(this.canUndo()) {
                var marks = this.get('marks');
                this.set('history_marks', this.get('history_marks').push(marks.pop()));
                this.set('marks', marks);
            }
        },

        repeatMark: function(){
            if(this.canRepeat()) {
                var marks = this.get('marks');
                var history_marks = this.get('history_marks').pop();
                this.set('marks', this.get('marks').push(history_marks.pop()));
                this.set('history_marks', history_marks);
            }
        },

         canUndo: function(){
            return this.get('marks').length > 0;
         },

         canRepeat: function(){
             return this.get('history_marks').length > 0;
         },

         canClear: function(){
             return this.get('marks').length > 0;
         }

    });

    return GameModel;

});