define(['gui/button', 'util/logger'], function (Button, Logger) {
    return Button.extend({

        logger: Logger.getLogger('Loader', Logger.Levels.DEBUG),

        defaultTextColor: {
            R: 200,
            G: 200,
            B: 200,
            A: 1.0
        },

        init: function (options) {
            this._super(options);
            this.selectedAlpha = options.selectedAlpha || 1;
            this.unselectedAlpha = options.unselectedAlpha || 0.4;
            this.selected = false;
            this.scene = options.scene;
        },

        select: function(){
            this.selected = true;
        },

        unselect: function(){
            this.selected = false;
        },

        draw: function (context) {
            context.save();

            context.globalAlpha = this.selected ? this.selectedAlpha : this.unselectedAlpha;
            context.drawImage(this.img.data, this.img.sx, this.img.sy, this.img.w, this.img.h,
                this.pos.x, this.pos.y, this.size.w, this.size.h);

            if (this.text && !this.hideText) {
                context.fillStyle = "rgba(" + this.textColorR + "," + this.textColorG + ", " + this.textColorB + ", " + this.textColorA + ")";
                context.font = "16px Verdana";
                context.textAlign = "center";
                context.fillText(this.text, this.pos.x + this.size.w / 2, this.pos.y + this.size.h + 16);
            }
            context.globalAlpha = 1.0;

            context.restore();
        },

        hitTest: function (x, y) {
            return this.enabled && !(x < this.pos.x || x > this.pos.x + this.size.w
                || y < this.pos.y || y > this.pos.y + this.size.h);
        },

        onMouseDown: function (x, y, mouseEvent) {

        },

        onMouseUp: function (x, y, mouseEvent) {
        },

        press: function () {
            this.logger.info("Button ", (this.name ? this.name : this.text), " pressed");
            this.pressedCallback && this.pressedCallback();
        },

        update: function () {
        }
    })
});