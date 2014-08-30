define(['gui/button'], function(Button) {
  var HyperlinkButton = Button.extend({
    init: function(options) {
      this._super(options);
      this.url = options.url;
      this.size.w = 0;
      this.fontSize = 12;
      this.size.h = this.fontSize * 1.3;
      this.pressedCallback = (function() {
        options.pressedCallback();
        window.open(this.url,'_blank');
      }).bind(this);
    },
    draw: function(context) {
      context.save();

      if (this.text && !this.hideText) {
        context.fillStyle = "rgb(105,122,219)";
        context.font = this.fontSize + "px Verdana";
        context.textAlign = "left";
        context.textBaseline = "top";
        if (this.size.w === 0) {
          this.size.w = context.measureText(this.text).width;
        }
        context.fillText(this.text, this.pos.x, this.pos.y);
      }

      context.restore();
    }


  });
  return HyperlinkButton;
})