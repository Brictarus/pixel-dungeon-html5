define(['util/logger', 'scenes/base-scene', 'asset-loader', 'gui/button', 'gui/hyperlink', 'scenes/arcs'],
    function(Logger, BaseScene, AssetLoader, Button, Hyperlink, Arcs) {
  var AboutScene = BaseScene.extend({
    logger : Logger.getLogger('scenes.AboutScene', Logger.Levels.INFO),

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
          this.changeScene("TITLE", {
            arcsData: {
              arcs1VertOffset: this.arcs.arcs1VertOffset,
              arcs2VertOffset: this.arcs.arcs2VertOffset
            }
          });
        }).bind(this)
      });
      var gitLinkUrl = "https://github.com/Brictarus/pixel-dungeon";
      this.gitLink = new Hyperlink({
        text: gitLinkUrl,
        url: gitLinkUrl,
        position: {
          x: 20,
          y: 140
        },
        size: {
          w: (10 * this.zoom),
          h: (10 * this.zoom)
        },
        pressedCallback: (function() {
          this.logger.info('git link pressed');
        }).bind(this)
      });
      this.children.push(this.backButton);
      this.children.push(this.gitLink);

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

      var xOffsetText = 20;
      this.context.textBaseline = "top";
      this.context.font = "12px Verdana";
      this.context.fillStyle = "white";
      this.context.fillText("Adapted in HTML5: Brictarus", xOffsetText, 60);
      this.context.fillText("From original Android game Pixel Dungeon", xOffsetText, 80);
      this.context.fillText("The code is on GitHub:", xOffsetText, 120);

      // draw buttons
      this.children.forEach((function(element) {
        element.draw(this.context);
      }).bind(this));
    }

	});
	
	return AboutScene;
})