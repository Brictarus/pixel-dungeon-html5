define(['util/observer', 'util/logger'], function(Observer, Logger) {
  return Observer.extend({

    logger : Logger.getLogger('Loader', Logger.Levels.DEBUG),

    defaultTextColor: {
      R: 200,
      G: 200,
      B: 200,
      A: 1.0
    },

    init: function(options) {

      this.imgAlpha = this.targetImgAlpha = options.alpha ||  1.0;
      this.textColorR = this.targetTextColorR = this.defaultTextColor.R;
      this.textColorG = this.targetTextColorG = this.defaultTextColor.G;
      this.textColorB = this.targetTextColorB = this.defaultTextColor.B;
      this.textColorA = this.targetTextColorA = this.defaultTextColor.A;
      this.text = options.text;
      this.hideText = options.hideText || false;
      this.pos = options.position;
      this.size = options.size;
      this.enabled = (options.enabled == undefined) ? true : options.enabled;
      this.pressed = false;
      this.pressedCallback = options.pressedCallback;
    },

    draw: function(context) {
      context.save();
      context.fillStyle = "#FF0000";
      context.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);

      if (this.text && !this.hideText) {
        context.fillStyle = "rgba(" + this.textColorR  + "," + this.textColorG  + ", " + this.textColorB  + ", " + this.textColorA + ")";
        context.font = "16px Verdana";
        context.textAlign = "center";
        context.fillText(this.text, this.pos.x + this.size.w / 2, this.pos.y + this.size.h / 2 + 5);
      }

      context.restore();
    },

    hitTest: function(x, y) {
      return this.enabled && !(x < this.pos.x || x > this.pos.x + this.size.w
          || y < this.pos.y || y > this.pos.y + this.size.h);
    },

    onMouseDown: function(x, y, mouseEvent) {

    },

    onMouseUp: function(x, y, mouseEvent) {
    },

    press: function() {
      this.logger.info("Button ", (this.name ? this.name : this.text), " pressed");
      this.pressedCallback && this.pressedCallback();
    },

    update: function() {
    }
  })
});