define(['util/class'], function (Class) {
  return Class.extend({
    init: function (options) {
      this.pos = options.pos;
      this.size = options.size;
      this.images = options.images;
      this.zoom = options.zoom || 1;
      this.padding = options.padding || 0;

      this.prepareContainer();
      this.children = [];
    },

    update: function () {
      this.children.forEach((function (child) {
        child.update && child.update();
      }).bind(this));
    },

    prepareContainer: function () {
      if (this.images) {
        var ctl = this.images.cornerTopLeft;
        var ctr = this.images.cornerTopRight;
        var cbr = this.images.cornerBottomRight;
        var cbl = this.images.cornerBottomLeft;
        var sl = this.images.left;
        var st = this.images.top;
        var sr = this.images.right;
        var sb = this.images.bottom;
        var c = this.images.center;
        // top left
        ctl.x = this.pos.x;
        ctl.y = this.pos.y;
        ctl.w = ctl.sw * this.zoom;
        ctl.h = ctl.sh * this.zoom;
        // top right
        ctr.x = this.pos.x + this.size.w - ctr.sw * this.zoom;
        ctr.y = this.pos.y;
        ctr.w = ctr.sw * this.zoom;
        ctr.h = ctr.sh * this.zoom;
        // bottom right
        cbr.x = this.pos.x + this.size.w - cbr.sw * this.zoom;
        cbr.y = this.pos.y + this.size.h - cbr.sh * this.zoom;
        cbr.w = cbr.sw * this.zoom;
        cbr.h = cbr.sh * this.zoom;
        // bottom left
        cbl.x = this.pos.x;
        cbl.y = this.pos.y + this.size.h - cbl.sh * this.zoom;
        cbl.w = cbl.sw * this.zoom;
        cbl.h = cbl.sh * this.zoom;
        // left
        sl.x = this.pos.x;
        sl.y = this.pos.y + ctl.sh * this.zoom;
        sl.w = sl.sw * this.zoom;
        sl.h = this.size.h - this.zoom * (ctl.sh + cbl.sh);
        // top
        st.x = this.pos.x + ctl.sw * this.zoom;
        st.y = this.pos.y;
        st.w = this.size.w - 2 * (ctl.sw + ctr.sw);
        st.h = st.sh * this.zoom;
        // right
        sr.x = this.pos.x + this.size.w - sr.sw * this.zoom;
        sr.y = this.pos.y + ctr.sh * this.zoom;
        sr.w = sr.sw * this.zoom;
        sr.h = this.size.h - this.zoom * (ctr.sh + cbr.sh);
        // bottom
        sb.x = this.pos.x + cbl.sw * this.zoom;
        sb.y = this.pos.y + this.size.h - sb.sh * this.zoom;
        sb.w = this.size.w - 2 * (cbl.sw + cbr.sw);
        sb.h = sb.sh * this.zoom;
        // center
        c.x = this.pos.x + ctl.sw * this.zoom;
        c.y = this.pos.y + ctl.sh * this.zoom;
        c.w = this.size.w - 2 * (cbl.sw + cbr.sw);
        c.h = this.size.h - this.zoom * (ctr.sh + cbr.sh);
      }

      this.contentPos = {
        x: this.pos.x + this.padding * this.zoom,
        y: this.pos.y + this.padding * this.zoom
      }
      this.contentSize = {
        w: this.size.w - 2 * this.padding * this.zoom,
        h: this.size.h - 2 * this.padding * this.zoom
      }
      this.contentOffset = {
        x: 0, y: 0
      }
    },

    draw: function (context) {
      context.save();

      if (this.images) {
        var img = this.images.spriteImg;
        var ctl = this.images.cornerTopLeft;
        var ctr = this.images.cornerTopRight;
        var cbr = this.images.cornerBottomRight;
        var cbl = this.images.cornerBottomLeft;
        var sl = this.images.left;
        var st = this.images.top;
        var sr = this.images.right;
        var sb = this.images.bottom;
        var c = this.images.center;

        context.globalAlpha = 0.95;
        // top left
        context.drawImage(img, ctl.sx, ctl.sy, ctl.sw, ctl.sh, ctl.x, ctl.y, ctl.w, ctl.h);
        // top right
        context.drawImage(img, ctr.sx, ctr.sy, ctr.sw, ctr.sh, ctr.x, ctr.y, ctr.w, ctr.h);
        // bottom right
        context.drawImage(img, cbr.sx, cbr.sy, cbr.sw, cbr.sh, cbr.x, cbr.y, cbr.w, cbr.h);
        // bottom left
        context.drawImage(img, cbl.sx, cbl.sy, cbl.sw, cbl.sh, cbl.x, cbl.y, cbl.w, cbl.h);
        // left
        context.drawImage(img, sl.sx, sl.sy, sl.sw, sl.sh, sl.x, sl.y, sl.w, sl.h);
        // top
        context.drawImage(img, st.sx, st.sy, st.sw, st.sh, st.x, st.y, st.w, st.h);
        // right
        context.drawImage(img, sr.sx, sr.sy, sr.sw, sr.sh, sr.x, sr.y, sr.w, sr.h);
        // bottom
        context.drawImage(img, sb.sx, sb.sy, sb.sw, sb.sh, sb.x, sb.y, sb.w, sb.h);
        // center
        context.drawImage(img, c.sx, c.sy, c.sw, c.sh, c.x, c.y, c.w, c.h);
        context.globalAlpha = 1.0;
      }

      context.beginPath();
      context.rect(this.contentPos.x, this.contentPos.y, this.contentSize.w, this.contentSize.h);
      context.clip();

      this.children.forEach((function (child) {
        if (child.draw && child.pos && this.isChildVisible(child)) {
          child.draw(context);
        }
      }).bind(this));

      if (this.text) {
        this.wrapText(context, this.text, ctl.x + 16, ctl.y + 34, this.contentSize.w - 6, 20);
      }

      context.restore();
    },

    isChildVisible: function (child) {
      return (child.pos && child.size && (child.pos.y < this.contentPos.y + this.contentSize.h + this.contentOffset.y) &&
        (child.pos.y + child.size.h > this.contentPos.y + this.contentOffset.y))
    },

    setText: function (text) {
      this.text = text;
    },

    wrapText: function (context, text, x, y, maxWidth, lineHeight) {
      text = text.replace('\n', ' \n ');
      var words = text.split(' ');
      var line = '';
      context.font = '16pt Calibri';
      context.fillStyle = '#FFF';
      for (var n = 0; n < words.length; n++) {
        if(words[n] === '\n'){
          y += lineHeight;
          continue;
        }
        var testLine = line + words[n] + ' ';

        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        }
        else {
          line = testLine;
        }
      }
      context.fillText(line, x, y);
    }
  });
});