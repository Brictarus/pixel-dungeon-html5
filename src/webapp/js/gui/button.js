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
      this.img = options.img;
      this.pos = options.position;
      this.size = options.size;
      this.enabled = (options.enabled == undefined) ? true : options.enabled;
      this.pressed = false;
      this.pressedCallback = options.pressedCallback;
    },

    draw: function(context) {
      context.save();

      context.globalAlpha = this.imgAlpha;
      context.drawImage(this.img.data, this.img.sx, this.img.sy, this.img.w, this.img.h,
          this.pos.x, this.pos.y, this.size.w, this.size.h);
      context.globalAlpha = 1.0;

      if (this.text && !this.hideText) {
        context.fillStyle = "rgba(" + this.textColorR  + "," + this.textColorG  + ", " + this.textColorB  + ", " + this.textColorA + ")";
        context.font = "16px Verdana";
        context.textAlign = "center";
        context.fillText(this.text, this.pos.x + this.size.w / 2, this.pos.y + this.size.h + 16);
      }

      /*if (this.pressed) {
        context.strokeStyle = "red";
        context.strokeRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
      }*/

      context.restore();
    },

    hitTest: function(x, y) {
      return this.enabled && !(x < this.pos.x || x > this.pos.x + this.size.w
          || y < this.pos.y || y > this.pos.y + this.size.h);
    },

    onMouseDown: function(x, y, mouseEvent) {
      this.pressed = true;
      this.targetImgAlpha = 0.5;
      this.targetTextColorR = 255;
      this.targetTextColorG = 255;
      this.targetTextColorB = 0;
    },

    onMouseUp: function(x, y, mouseEvent) {
      this.pressed = false;
      this.targetImgAlpha = 1.0;
      this.targetTextColorR = this.defaultTextColor.R;
      this.targetTextColorG = this.defaultTextColor.G;
      this.targetTextColorB = this.defaultTextColor.B;
      this.targetTextColorA = this.defaultTextColor.A;
    },

    press: function() {
      this.logger.info("Button ", (this.name ? this.name : this.text), " pressed");
      this.pressedCallback && this.pressedCallback();
    },

    update: function() {
      if (this.imgAlpha > this.targetImgAlpha) {
        this.imgAlpha -= 0.02;
      } else if (this.imgAlpha < this.targetImgAlpha) {
        this.imgAlpha += 0.02;
      }

      var textColorAnimationSpeed = 5;
      if (this.textColorR > this.targetTextColorR) {
        this.textColorR = Math.max(0, this.textColorR - textColorAnimationSpeed);
      } else if (this.textColorR < this.targetTextColorR) {
        this.textColorR = Math.min(255, this.textColorR + textColorAnimationSpeed);
      }
      if (this.textColorG > this.targetTextColorG) {
        this.textColorG = Math.max(0, this.textColorG - textColorAnimationSpeed);
      } else if (this.textColorG < this.targetTextColorG) {
        this.textColorG = Math.min(255, this.textColorG + textColorAnimationSpeed);
      }
      if (this.textColorB > this.targetTextColorB) {
        this.textColorB = Math.max(0, this.textColorB - textColorAnimationSpeed);
      } else if (this.textColorB < this.targetTextColorB) {
        this.textColorB = Math.min(255, this.textColorB + textColorAnimationSpeed);
      }
      if (this.textColorA > this.targetTextColorA) {
        this.textColorA = Math.max(0.0, this.textColorA - 0.02);
      } else if (this.textColorA < this.targetTextColorA) {
        this.textColorA = Math.min(1.0, this.textColorA + 0.02);
      }
    }
  })
});