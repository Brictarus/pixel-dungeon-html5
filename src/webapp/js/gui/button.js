define(['util/observer', 'util/logger'], function(Observer, Logger) {
  return Observer.extend({

    logger : Logger.getLogger('Loader', Logger.Levels.DEBUG),

    init: function(options) {
      this.text = options.text;
      this.hideText = options.hideText || false;
      this.img = options.img;
      this.pos = options.position;
      this.size = options.size;
      this.enabled = (options.enabled == undefined) ? true : options.enabled;
      this.pressed = false;
      this.pressedCallback = options.pressedCallback;
    },

    draw: function(context) {
      context.save();

      context.drawImage(this.img.data, this.img.sx, this.img.sy, this.img.w, this.img.h,
          this.pos.x, this.pos.y, this.size.w, this.size.h);
      if (this.text && !this.hideText) {
        context.fillStyle = "white";
        context.font = "16px Verdana";
        context.textAlign = "center";
        context.fillText(this.text, this.pos.x + this.size.w / 2, this.pos.y + this.size.h + 16);
      }

      if (this.pressed) {
        context.strokeStyle = "red";
        context.strokeRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
      }

      context.restore();
    },

    hitTest: function(x, y) {
      return this.enabled && !(x < this.pos.x || x > this.pos.x + this.size.w
          || y < this.pos.y || y > this.pos.y + this.size.h);
    },

    onMouseDown: function(x, y, mouseEvent) {
      this.pressed = true;
    },

    onMouseUp: function(x, y, mouseEvent) {
      this.pressed = false;
    },

    press: function() {
      this.logger.info("Button ", (this.name ? this.name : this.text), " pressed");
      this.pressedCallback && this.pressedCallback();
    }
  })
});