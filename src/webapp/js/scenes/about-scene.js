define(['util/observer', 'asset-loader', 'gui/button'], function(Observer, AssetLoader, Button) {
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
      var canvasW = this.width,
          canvasH = this.height;

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
      var arcs1Img = this.aLoader.spriteData('arcs1').image;
      var arcs2Img = this.aLoader.spriteData('arcs2').image;

      this.arcs1ImgWidthZoomed = arcs1Img.width * this.zoom;
      this.arcs1ImgHeightZoomed = arcs1Img.height * this.zoom;
      this.arcs2ImgWidthZoomed = arcs2Img.width * this.zoom;
      this.arcs2ImgHeightZoomed = arcs2Img.height * this.zoom;

      this.arcs1HorizOffset = this.arcs1ImgHeightZoomed / 3;

      this.arcs1VertSpeed = 0.5;
      this.arcs2VertSpeed = 1;
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
      this.arcs1VertOffset -= this.arcs1VertSpeed;
      if (-this.arcs1VertOffset >= this.arcs1ImgHeightZoomed) {
        this.arcs1VertOffset = 0;
      }
      this.arcs2VertOffset -= this.arcs2VertSpeed;
      if (-this.arcs2VertOffset >= this.arcs2ImgHeightZoomed) {
        this.arcs2VertOffset = 0;
      }
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

      var arcs1Img = this.aLoader.spriteData('arcs1').image;
      var arcs2Img = this.aLoader.spriteData('arcs2').image;
      var canvasW = this.width,
          canvasH = this.height,
          zoom = this.zoom;

      // draw arcs
      var arcs1WidthCount = Math.ceil(canvasW / (arcs1Img.width * zoom));
      var arcs1HeightCount = Math.ceil(canvasH / (arcs1Img.height * zoom));
      for (var iArcs1 = 0; iArcs1 <= arcs1WidthCount; iArcs1++) {
        for (var jArcs1 = 0; jArcs1 <= arcs1HeightCount; jArcs1++) {
          this.context.drawImage(arcs1Img, 0, 0, arcs1Img.width, arcs1Img.height,
              (iArcs1 * this.arcs1ImgWidthZoomed) - this.arcs1HorizOffset, (jArcs1 * arcs1Img.height * zoom) + this.arcs1VertOffset, this.arcs1ImgWidthZoomed, this.arcs1ImgHeightZoomed);
        }
      }
      var arcs2WidthCount = Math.ceil(canvasW / (arcs2Img.width * zoom));
      var arcs2HeightCount = Math.ceil(canvasH / (arcs2Img.height * zoom));
      for (var iArcs2 = 0; iArcs2 < arcs2WidthCount; iArcs2++) {
        for (var jArcs2 = 0; jArcs2 <= arcs2HeightCount; jArcs2++) {
          this.context.drawImage(arcs2Img, 0, 0, arcs2Img.width, arcs2Img.height,
              (iArcs2 * this.arcs2ImgWidthZoomed), (jArcs2 * this.arcs2ImgHeightZoomed) + this.arcs2VertOffset, this.arcs2ImgWidthZoomed, this.arcs2ImgHeightZoomed);
        }
      }

      var xOffsetText = 20;
      this.context.font = "12px Verdana";
      this.context.fillStyle = "white";
      //console.log("measureText", this.context.measureText("Adapted in HTML5: Brictarus"));
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