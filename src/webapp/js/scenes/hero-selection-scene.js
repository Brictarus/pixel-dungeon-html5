define(['scenes/base-scene', 'asset-loader', 'gui/button', 'gui/radio-button', 'scenes/arcs'],
    function (BaseScene, AssetLoader, Button, RadioButton, Arcs) {
      var TitleScene = BaseScene.extend({
        init: function (options) {
          this._super(options);

          if (options.arcsData) {
            this.arcs1VertOffset = options.arcsData.arcs1VertOffset;
            this.arcs2VertOffset = options.arcsData.arcs2VertOffset;
          } else {
            this.arcs1VertOffset = 0;
            this.arcs2VertOffset = 0;
          }

          this.aLoader = new AssetLoader(this.game.config.assetConfig);
          this.aLoader.addSprite("avatars", "png");
          this.aLoader.addSprite("arcs1", "png");
          this.aLoader.addSprite("arcs2", "png");
          this.aLoader.addSprite("icons", "png");

          this.aLoader.load(this.onResourcesLoaded.bind(this));
        },

        initScene: function () {
          var canvasH = this.height;
          var canvasW = this.width;

          // boutons
          var xOffset = ((canvasW / 2) - 24) / 2;
          var avatarsImg = this.aLoader.spriteData('avatars').image;
          var iconsImg = this.aLoader.spriteData('icons').image;
          this.warriorButton = new RadioButton({
            scene: this,
            text: "WARRIOR",
            img: {
              data: avatarsImg,
              sx: 0, sy: 0, w: 24, h: 32
            },
            position: {
              x: xOffset,
              y: (canvasH / 3) + (avatarsImg.height / 2) + 30
            },
            size: {
              w: 24 * this.zoom,
              h: 32 * this.zoom
            },
            alpha: 0.2,
            pressedCallback: function () {
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
              y: (canvasH / 3) + (avatarsImg.height / 2) + 30
            },
            size: {
              w: 24 * this.zoom,
              h: 32 * this.zoom
            },
            alpha: 0.2,
            pressedCallback: function () {
              this.scene.selectHero(this)
            }
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
              y: (canvasH / 3) + (avatarsImg.height / 2) + 150
            },
            size: {
              w: 24 * this.zoom,
              h: 32 * this.zoom
            },
            alpha: 0.2,
            pressedCallback: function () {
              this.scene.selectHero(this)
            }
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
              y: (canvasH / 3) + (avatarsImg.height / 2) + 150
            },
            size: {
              w: 24 * this.zoom,
              h: 32 * this.zoom
            },
            alpha: 0.2,
            pressedCallback: function () {
              this.scene.selectHero(this)
            }
          });

          this.backButton = new Button({
            text: "Retour",
            hideText: true,
            img: {
              data: iconsImg,
              sx: 1, sy: 46, w: 11, h: 11
            },
            position: {
              x: canvasW - (10 * this.zoom) - 10,
              y: 10
            },
            size: {
              w: (10 * this.zoom),
              h: (10 * this.zoom)
            },
            pressedCallback: (function () {
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

        selectHero: function (heroButton) {
          if (this.selectedHero) {
            this.selectedHero.unselect();
          }
          this.selectedHero = heroButton;
        },

        update: function () {
          this._super();

          // background scrolling
          this.arcs.update();
        },

        draw: function () {
          var canvasW = this.width,
              canvasH = this.height,
              zoom = this.zoom;

          this.arcs.draw(this.context);

          // draw title
          var titleImg = this.aLoader.spriteData('banners').image;
          this.context.drawImage(titleImg, 0, 0, titleImg.width, 68,
              (canvasW / 2) - (titleImg.width / 2 * zoom), (canvasH / 3) - (titleImg.height / 2), titleImg.width * 2, 68 * zoom);

          // draw buttons
          this.children.forEach((function (element) {
            element.draw(this.context);
          }).bind(this));

          /*this.context.textAlign = "right";
           this.context.fillStyle = "white";
           this.context.font = "10px Verdana";
           this.context.fillText("v. " +this.game.config.version, canvasW, canvasH - 2);*/
        }

      });

      return TitleScene;
    })