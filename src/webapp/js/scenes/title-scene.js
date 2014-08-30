define(['util/observer', 'asset-loader', 'gui/button', 'scenes/arcs'], function(Observer, AssetLoader, Button, Arcs) {
  var TitleScene = Observer.extend({
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
      this.aLoader.addSprite("banners", "png");
      this.aLoader.addSprite("dashboard", "png");
      this.aLoader.addSprite("arcs1", "png");
      this.aLoader.addSprite("arcs2", "png");

      this.aLoader.load(this.onResourcesLoaded.bind(this));

      this.children = [];
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
        }
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
        }
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
        }
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
          this.game.changeScene({
            sceneName: "ABOUT",
            arcsData: {
              arcs1VertOffset: this.arcs1VertOffset,
              arcs2VertOffset: this.arcs2VertOffset
            }
          });
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
      var canvasW = this.width,
          canvasH = this.height,
          zoom = this.zoom;

      this.context.save();
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
      this.context.restore();
    }

	});
	
	return TitleScene;
})