define(['util/logger', 'util/observer'],
    function(Logger, Observer) {
  var BaseScene = Observer.extend({
    logger : Logger.getLogger('util.BaseScene', Logger.Levels.INFO),

    init: function(options) {
      this.game = options.game;
      this.zoom = options.zoom;
      this.height = options.height;
      this.width = options.width;
      this.context = options.context;

      this.mouseDownEvent = null;
      this.children = [];
      this.ready = false;
		},

    clearContext: function() {
      this.context.clearRect(0, 0, this.width, this.height);
    },

    _update: function() {
      if (this.ready) {
        this.update();
        this.children.forEach((function(element) {
          element.update && element.update();
        }).bind(this));
      }
    },

    onMouseDown: function(x, y, mouseEvent) {
      var hit = this.hitTest(x, y);
      if (hit && hit.onMouseDown) {
        this.mouseDownEvent = mouseEvent;
        mouseEvent.hit = hit;
        hit.onMouseDown(x, y, mouseEvent);
      }
    },

    onMouseUp: function(x, y, mouseEvent) {
      var hit = this.hitTest(x, y);
      this.children.forEach((function(el) {
        if (el.onMouseUp) {
          el.onMouseUp(x, y, mouseEvent);
        }
      }).bind(this));
      if (hit) {
        // check if mouse down target equals the one of mouse up
        if (this.mouseDownEvent && this.mouseDownEvent.hit == hit && hit.press) {
          hit.press();
        }
      }
      this.mouseDownEvent = null;
    },

    hitTest: function(x, y) {
      for (var i = this.children.length - 1; i >=  0; i --) {
        if (this.children[i].hitTest) {
          var res = this.children[i].hitTest(x, y);
          if (res === true) return this.children[i];
        }
      }
      return null;
    },

    changeScene: function(sceneName, data) {
      data = data || {};
      data.sceneName = sceneName;
      this.game.changeScene(data);
    },

    _draw: function() {
      if (this.ready) {
        this.context.save();
        this.draw();
        this.context.restore();
      }
    },

    draw: function() {
    }

	});
	
	return BaseScene;
})