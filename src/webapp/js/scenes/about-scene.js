define(['util/observer', 'asset-loader', 'gui/button', 'scenes/arcs'], function(Observer, AssetLoader, Button, Arcs) {
  var AboutScene = Observer.extend({
		init: function(options) {
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
      this.aLoader.addSprite("arcs1", "png");
      this.aLoader.addSprite("arcs2", "png");
      this.aLoader.addSprite("icons", "png");
      this.aLoader.load(this.onResourcesLoaded.bind(this));

      this.children = [];
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
        pressedCallback: (function() {
          this.game.changeScene({
            sceneName: "TITLE",
            arcsData: {
              arcs1VertOffset: this.arcs1VertOffset,
              arcs2VertOffset: this.arcs2VertOffset
            }
          });
        }).bind(this)
      });
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

    onResourcesLoaded: function() {
      this.initScene();

      this.start();
    },

    step: function() {
      this.context.clearRect(0, 0, this.width, this.height);
      this.update();
      this.draw();
      if (this.started) {
        requestAnimationFrame(this.step.bind(this), null);
      }
    },

    start: function() {
      this.started = true;
      this.step();
    },

    stop: function() {
      this.started = false;
    },

    update: function() {
      // background scrolling
      this.arcs.update();

      this.children.forEach((function(element) {
        element.update && element.update();
      }).bind(this));
    },

    onMouseDown: function(x, y, mouseEvent) {
      var hit = this.hitTest(x, y);
      if (hit && hit.onMouseDown) {
        this.mouseDownEvent = mouseEvent;
        mouseEvent.hit = hit;
        hit.onMouseDown(x, y, mouseEvent);
      }
    },

    onMouseUp: function(x, y, mouseEvent) {
      var hit = this.hitTest(x, y);
      this.children.forEach((function(el) {
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

    hitTest: function(x, y) {
      for (var i = this.children.length - 1; i >=  0; i --) {
        if (this.children[i].hitTest) {
          var res = this.children[i].hitTest(x, y);
          if (res === true) return this.children[i];
        }
      }
      return null;
    },

    draw: function() {
      this.context.save();

      this.arcs.draw(this.context);

      var xOffsetText = 20;
      this.context.font = "12px Verdana";
      this.context.fillStyle = "white";
      this.context.fillText("Adapted in HTML5: Brictarus", xOffsetText, 60);
      this.context.fillText("From original Android game Pixel Dungeon", xOffsetText, 80);

      this.context.fillText("The code is on GitHub:", xOffsetText, 120);
      this.context.fillStyle = "blue";
      this.context.fillText("https://github.com/Brictarus/pixel-dungeon", xOffsetText, 140 );



      // draw buttons
      this.children.forEach((function(element) {
        element.draw(this.context);
      }).bind(this));


      this.context.restore();
    }

	});
	
	return AboutScene;
})