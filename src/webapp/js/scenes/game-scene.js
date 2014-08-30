define(['util/observer', 'asset-loader', 'gui/button', 'scenes/arcs'], function (Observer, AssetLoader, Button, Arcs) {
    var GameScene = Observer.extend({
        init: function (options) {
            this.game = options.game;
            this.zoom = options.zoom;
            this.height = options.height;
            this.width = options.width;
            this.context = options.context;

            this.started = false;

            this.aLoader = new AssetLoader(this.game.config.assetConfig);
            this.aLoader.addSprite("banners", "png");
            this.aLoader.addSprite("dashboard", "png");
            this.aLoader.addSprite("arcs1", "png");
            this.aLoader.addSprite("arcs2", "png");

            this.aLoader.load(this.onResourcesLoaded.bind(this));

            this.children = [];
        },

        initScene: function () {

        },

        onResourcesLoaded: function () {
            this.initScene();

            this.start();
        },

        step: function () {
            this.context.clearRect(0, 0, this.width, this.height);
            this.update();
            this.draw();
            if (this.started) {
                requestAnimationFrame(this.step.bind(this), null);
            }
        },

        changeScene: function (sceneName) {
            this.game.changeScene({
                sceneName: sceneName
            });
        },

        start: function () {
            this.started = true;
            this.step();
        },

        stop: function () {
            this.started = false;
        },

        update: function () {

            this.children.forEach((function (element) {
                element.update && element.update();
            }).bind(this));
        },

        onMouseDown: function (x, y, mouseEvent) {
            var hit = this.hitTest(x, y);
            if (hit && hit.onMouseDown) {
                this.mouseDownEvent = mouseEvent;
                mouseEvent.hit = hit;
                hit.onMouseDown(x, y, mouseEvent);
            }
        },

        onMouseUp: function (x, y, mouseEvent) {
            var hit = this.hitTest(x, y);
            this.children.forEach((function (el) {
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

        hitTest: function (x, y) {
            for (var i = this.children.length - 1; i >= 0; i--) {
                if (this.children[i].hitTest) {
                    var res = this.children[i].hitTest(x, y);
                    if (res === true) return this.children[i];
                }
            }
            return null;
        },

        draw: function () {

            this.context.save();

            // draw buttons
            this.children.forEach((function (element) {
                element.draw(this.context);
            }).bind(this));

            this.context.restore();
        }

    });

    return GameScene;
})