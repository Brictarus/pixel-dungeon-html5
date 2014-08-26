define(['util/observer'], function(Observer) {
  return Observer.extend({
    init: function(options) {
      this.text = options.text;
      this.img = options.img;
      this.pos = options.position;
      this.size = options.size;
      this.enabled = (options.enabled == undefined) ? true : options.enabled;
    },

    draw: function(context) {
      context.save();

      /*context.strokeStyle = "red";
      context.strokeRect(this.pos.x, this.pos.y, this.size.w, this.size.h);*/
      context.drawImage(this.img.data, this.img.sx, this.img.sy, this.img.w, this.img.h,
          this.pos.x, this.pos.y, this.size.w, this.size.h);
      if (this.text) {
        context.fillStyle = "white";
        context.font = "16px Verdana";
        context.textAlign = "center";
        context.fillText(this.text, this.pos.x + this.size.w / 2, this.pos.y + this.size.h + 16);
      }

      context.restore();
    }
  })
});