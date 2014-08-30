define(['util/class'], function(Class) {
  return Class.extend({
    init: function(options) {
      this.desc = options.desc;
      this.img = options.img;
      this.rawImg = options.rawImg;
      this.size = options.size;
      this.pos = options.pos;
      this.zoom = options.zoom || 2;
    },

    draw: function(context) {
      context.save();
      var img = this.img;
      context.drawImage(this.rawImg, img.sx, img.sy, img.sw, img.sh,
          this.pos.x, this.pos.y, img.sw * this.zoom, img.sh * this.zoom);
      context.textBaseline = "middle";
      context.textAlign = "left";
      context.fillStyle = "#FFF";
      context.font = "12px Verdana";
      context.fillText(this.desc, this.pos.x + img.sw * this.zoom + 10, this.pos.y + img.sh * this.zoom / 2)
      context.restore();
    }
  });
})