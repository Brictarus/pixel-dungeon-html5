define(['util/logger', 'scenes/base-scene', 'asset-loader', 'gui/button', 'gui/badges-panel', 'gui/hyperlink', 'scenes/arcs'],
    function(Logger, BaseScene, AssetLoader, Button, BadgesPanel, Hyperlink, Arcs) {
  var BadgesScene = BaseScene.extend({
    logger : Logger.getLogger('scenes.RankingsScene', Logger.Levels.INFO),

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
      this.aLoader.addSprite("arcs1", "png");
      this.aLoader.addSprite("arcs2", "png");
      this.aLoader.addSprite("icons", "png");
      this.aLoader.addSprite("chrome", "png");
      this.aLoader.addSprite("badges", "png");
      this.aLoader.load(this.onResourcesLoaded.bind(this));
		},

    initScene: function() {
      var canvasW = this.width;

      // boutons
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

      this.panel = new BadgesPanel({
        pos: { x: 20, y: 50 }, size: { w: this.width - 20 * 2, h: this.height - 50 - 15 },
        badgesConfig: this.game.config.assetConfig.badges,
        zoom: this.zoom,
        padding: 6,
        badgesImage: this.aLoader.spriteData('badges').image,
        images: {
          spriteImg: this.aLoader.spriteData('chrome').image,
          cornerTopLeft: {
            sx: 0, sy: 0, sw: 11, sh: 11
          }, cornerTopRight: {
            sx: 11, sy: 0, sw: 11, sh: 11
          }, cornerBottomRight: {
            sx: 11, sy: 11, sw: 11, sh: 11
          }, cornerBottomLeft: {
            sx: 0, sy: 11, sw: 11, sh: 11
          }, left: {
            sx: 0, sy: 11, sw: 11, sh: 1
          }, top: {
            sx: 11, sy: 0, sw: 1, sh: 11
          }, right: {
            sx: 11, sy: 11, sw: 11, sh: 1
          }, bottom: {
            sx: 11, sy: 11, sw: 1, sh: 11
          },
          center: {
            sx: 10, sy: 10, sw: 1, sh: 1
          }
        }
      });

      this.children.push(this.backButton);
      this.children.push(this.panel);

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

    onResourcesLoaded: function() {
      this.initScene();
      this.ready = true;
    },

    update: function() {
      // background scrolling
      this.arcs.update();
    },

    draw: function() {
      this.arcs.draw(this.context);

      this.context.font = "16px Verdana";
      this.context.fillStyle = "yellow";
      this.context.strokeStyle = "black";
      this.context.textBaseline = "top";
      this.context.textAlign = "center"
      this.context.fillText("Your Badges", this.width / 2, 12);

      // draw buttons
      this.children.forEach((function(element) {
        element.draw(this.context);
      }).bind(this));
    }

	});
	
	return BadgesScene;
})