define(['scenes/base-scene', 'util/logger', 'asset-loader', 'gui/button', 'scenes/arcs'],
    function(BaseScene, Logger, AssetLoader, Button, Arcs) {
  var TitleScene = BaseScene.extend({

    logger : Logger.getLogger('scenes.TitleScene', Logger.Levels.INFO),

    init: function(options) {
      this._super(options);

      if (options.arcsData) {
        this.arcs1VertOffset = options.arcsData.arcs1VertOffset;
        this.arcs2VertOffset = options.arcsData.arcs2VertOffset;
      } else {
        this.arcs1VertOffset = 0;
        this.arcs2VertOffset = 0;
      }

      this.aLoader = new AssetLoader(this.game.config.assetConfig);
      this.aLoader.addSprite("banners", "png");
      this.aLoader.addSprite("dashboard", "png");
      this.aLoader.addSprite("arcs1", "png");
      this.aLoader.addSprite("arcs2", "png");
      this.aLoader.load(this.onResourcesLoaded.bind(this));
		},

    onResourcesLoaded: function() {
      this.initScene();
      this.ready = true;
    },

    initScene: function() {
      var canvasH = this.height;

      // boutons
      var dashboardImg = this.aLoader.spriteData('dashboard').image;
      this.playButton = new Button({
        text: "Play",
        img: {
          data: dashboardImg,
          sx: 0, sy: 0, w: 32, h: 32
        },
        position: {
          x: 60,
          y: (canvasH / 3) + (dashboardImg.height / 2) + 30
        },
        size: {
          w: 32 * this.zoom,
          h: 32 * this.zoom
        },
        pressedCallback: (function() {
          this.changeScene("HERO_SELECTION", {
            arcsData: {
              arcs1VertOffset: this.arcs.arcs1VertOffset,
              arcs2VertOffset: this.arcs.arcs2VertOffset
            }
          });
        }).bind(this)
      });

      this.rankingButton = new Button({
        text: "Rankings",
        img: {
          data: dashboardImg,
          sx: 64, sy: 0, w: 32, h: 32
        },
        position: {
          x: 170,
          y: (canvasH / 3) + (dashboardImg.height / 2) + 30
        },
        size: {
          w: 32 * this.zoom,
          h: 32 * this.zoom
        },
        pressedCallback: (function() {
          this.changeScene("RANKINGS", {
            arcsData: {
              arcs1VertOffset: this.arcs.arcs1VertOffset,
              arcs2VertOffset: this.arcs.arcs2VertOffset
            }
          })
        }).bind(this)
      });

      this.badgesButton = new Button({
        text: "Badges",
        img: {
          data: dashboardImg,
          sx: 96, sy: 0, w: 32, h: 32
        },
        position: {
          x: 60,
          y: (canvasH / 3) + (dashboardImg.height / 2) + 150
        },
        size: {
          w: 32 * this.zoom,
          h: 32 * this.zoom
        },
        pressedCallback: (function() {
          this.changeScene("BADGES", {
            arcsData: {
              arcs1VertOffset: this.arcs.arcs1VertOffset,
              arcs2VertOffset: this.arcs.arcs2VertOffset
            }
          })
        }).bind(this)
      });

      this.aboutButton = new Button({
        text: "About",
        img: {
          data: dashboardImg,
          sx: 32, sy: 0, w: 32, h: 32
        },
        position: {
          x: 170,
          y: (canvasH / 3) + (dashboardImg.height / 2) + 150
        },
        size: {
          w: 32 * this.zoom,
          h: 32 * this.zoom
        },
        pressedCallback: (function() {
          this.changeScene("ABOUT", {
            arcsData: {
              arcs1VertOffset: this.arcs.arcs1VertOffset,
              arcs2VertOffset: this.arcs.arcs2VertOffset
            }
          })
        }).bind(this)
      });

      this.children.push(this.playButton);
      this.children.push(this.rankingButton);
      this.children.push(this.badgesButton);
      this.children.push(this.aboutButton);

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

    update: function() {
      // background scrolling
      this.arcs.update();
    },

    draw: function() {
      var canvasW = this.width,
          canvasH = this.height,
          zoom = this.zoom;

      var titleImg = this.aLoader.spriteData('banners').image;

      this.arcs.draw(this.context);

      // draw title
      this.context.drawImage(titleImg, 0, 0, titleImg.width, 68,
          (canvasW / 2) - (titleImg.width / 2 * zoom), (canvasH / 3) - (titleImg.height / 2), titleImg.width * 2, 68 * zoom);

      // draw buttons
      this.children.forEach((function(element) {
        element.draw(this.context);
      }).bind(this));

      this.context.textAlign = "right";
      this.context.fillStyle = "white";
      this.context.font = "10px Verdana";
      this.context.fillText("v. " +this.game.config.version, canvasW, canvasH - 2);
    }
	});
	
	return TitleScene;
})