define(['util/class'], function(Class) {
  var Observer = Class.extend({
    _eventToListeners : {},

    on : function (event, callback, context) {
      if (!this._eventToListeners.hasOwnProperty(event)) {
        this._eventToListeners[event] = [];
      }
      this._eventToListeners[event].push({ callback : callback, context : context });
    },

    trigger : function (event, args) {
      if (this._eventToListeners.hasOwnProperty(event)) {
        for (var i = 0; i < this._eventToListeners[event].length; ++i) {
          try {
            var handler = this._eventToListeners[event][i];
            handler.callback.call(handler.context || this || window, args);
          } catch (e) {
            if (console) {
              if (console.error) console.error(e);
              else if (console.log) console.log(e);
            }
          }
        }
      }
    },

    destroy: function() {
      this._eventToListeners = null;
    }
  });

  return Observer;
});