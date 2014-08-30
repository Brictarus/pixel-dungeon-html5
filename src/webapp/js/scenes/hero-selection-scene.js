define(['util/observer', 'asset-loader', 'gui/button',  'gui/radio-button', 'scenes/arcs'],
    function (Observer, AssetLoader, Button, RadioButton, Arcs) {
    var TitleScene = Observer.extend({
        init: function (options) {
            this.game = options.game;
            this.zoom = options.zoom;
            this.height = options.height;
            this.width = options.width;
            this.context = options.context;

            if (options.arcsData) {
                this.arcs1VertOffset = options.arcsData.arcs1VertOffset;
                this.arcs2VertOffset = options.arcsData.arcs2VertOffset;
            } else {
                this.arcs1VertOffset = 0;
                this.arcs2VertOffset = 0;
            }
            this.started = false;

            this.aLoader = new AssetLoader(this.game.config.assetConfig);
            this.aLoader.addSprite("avatars", "png");
            this.aLoader.addSprite("arcs1", "png");
            this.aLoader.addSprite("arcs2", "png");
            this.aLoader.addSprite("icons", "png");
            this.aLoader.load(this.onResourcesLoaded.bind(this));

            this.children = [];
        },

        initScene: function () {
            var canvasH = this.height;
            var canvasW = this.width;

            // boutons
            var xOffset = ((canvasW / 2) - 24) / 2;
            var avatarsImg = this.aLoader.spriteData('avatars').image;
            this.warriorButton = new RadioButton({
                scene: this,
                text: "WARRIOR",
                img: {
                    data: avatarsImg,
                    sx: 0, sy: 0, w: 24, h: 32
                },
                position: {
                    x: xOffset,
                    y: (canvasH / 3) + (avatarsImg.height / 2) - 50
                },
                size: {
                    w: 24 * this.zoom,
                    h: 32 * this.zoom
                },
                alpha: 0.2,
                pressedCallback: function(){
                    this.scene.selectHero(this);
                }
            });

            this.mageButton = new RadioButton({
                scene: this,
                text: "MAGE",
                img: {
                    data: avatarsImg,
                    sx: 24, sy: 0, w: 24, h: 32
                },
                position: {
                    x: xOffset + (canvasW / 2),
                    y: (canvasH / 3) + (avatarsImg.height / 2) - 50
                },
                size: {
                    w: 24 * this.zoom,
                    h: 32 * this.zoom
                },
                alpha: 0.2,
                pressedCallback: function(){ this.scene.selectHero(this)}
            });

            this.rogueButton = new RadioButton({
                scene: this,
                text: "ROGUE",
                img: {
                    data: avatarsImg,
                    sx: 48, sy: 0, w: 24, h: 32
                },
                position: {
                    x: xOffset,
                    y: (canvasH / 3) + (avatarsImg.height / 2) + 70
                },
                size: {
                    w: 24 * this.zoom,
                    h: 32 * this.zoom
                },
                alpha: 0.2,
                pressedCallback: function(){ this.scene.selectHero(this)}
            });

            this.huntressButton = new RadioButton({
                scene: this,
                text: "HUNTRESS",
                img: {
                    data: avatarsImg,
                    sx: 72, sy: 0, w: 24, h: 32
                },
                position: {
                    x: xOffset + (canvasW / 2),
                    y: (canvasH / 3) + (avatarsImg.height / 2) + 70
                },
                size: {
                    w: 24 * this.zoom,
                    h: 32 * this.zoom
                },
                alpha: 0.2,
                pressedCallback: function(){ this.scene.selectHero(this)}
            });

            var iconsImg = this.aLoader.spriteData('icons').image;
            this.backButton = new Button({
              text: "Retour",
              hideText: true,
              img: {
                data: iconsImg,
                sx: 98, sy: 0, w: 16, h: 14
              },
              position: {
                x: canvasW - (10 * this.zoom) - 10,
                y: 10
              },
              size: {
                w: (10 * this.zoom),
                h: (10 * this.zoom)
              },
              pressedCallback: (function() {
                this.game.changeScene({
                  sceneName: "TITLE",
                  arcsData: {
                    arcs1VertOffset: this.arcs.arcs1VertOffset,
                    arcs2VertOffset: this.arcs.arcs2VertOffset
                  }
                });
              }).bind(this)
            });

            this.children.push(this.warriorButton);
            this.children.push(this.mageButton);
            this.children.push(this.rogueButton);
            this.children.push(this.huntressButton);

            this.children.push(this.backButton);

            // défilement du background (arcs1 et arcs2)
            this.arcs = new Arcs({
                arcs1Asset: this.aLoader.spriteData('arcs1'),
                arcs2Asset: this.aLoader.spriteData('arcs2'),
                arcs1VertOffset: this.arcs1VertOffset,
                arcs2VertOffset: this.arcs2VertOffset,
                size: {
                    w: this.width,
                    h: this.height
                },
                zoom: this.zoom
            });
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
                sceneName: sceneName,
                arcsData: {
                    arcs1VertOffset: this.arcs.arcs1VertOffset,
                    arcs2VertOffset: this.arcs.arcs2VertOffset
                }
            });
        },

        selectHero: function(heroButton){
            if(this.selectedHero){
                this.selectedHero.unselect();
            }
            this.selectedHero = heroButton;
        },

        start: function () {
            this.started = true;
            this.step();
        },

        stop: function () {
            this.started = false;
        },

        update: function () {
            // background scrolling
            this.arcs.update();

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
            var canvasW = this.width,
                canvasH = this.height,
                zoom = this.zoom;

            this.context.save();

            this.arcs.draw(this.context);

            // draw title
            var titleImg = this.aLoader.spriteData('banners').image;
            this.context.drawImage(titleImg, 0, 136, titleImg.width, 28,
                    (canvasW / 2) - (titleImg.width / 2 * zoom), (canvasH / 3) - (titleImg.height / 2), titleImg.width * 2, 28 * zoom);

            // draw buttons
            this.children.forEach((function (element) {
                element.draw(this.context);
            }).bind(this));

            /*this.context.textAlign = "right";
             this.context.fillStyle = "white";
             this.context.font = "10px Verdana";
             this.context.fillText("v. " +this.game.config.version, canvasW, canvasH - 2);*/
            this.context.restore();
        }

    });

    return TitleScene;
})