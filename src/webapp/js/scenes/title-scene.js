define(['util/observer', 'asset-loader', 'gui/button'], function(Observer, AssetLoader, Button) {
  var TitleScene = Observer.extend({
		init: function(options) {
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
		},

    initScene: function() {
      var canvasW = this.width,
          canvasH = this.height;

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
        }
      });

      // défilement du background (arcs1 et arcs2)
      var arcs1Img = this.aLoader.spriteData('arcs1').image;
      var arcs2Img = this.aLoader.spriteData('arcs2').image;

      this.arcs1ImgWidthZoomed = arcs1Img.width * this.zoom;
      this.arcs1ImgHeightZoomed = arcs1Img.height * this.zoom;
      this.arcs2ImgWidthZoomed = arcs2Img.width * this.zoom;
      this.arcs2ImgHeightZoomed = arcs2Img.height * this.zoom;

      this.arcs1HorizOffset = this.arcs1ImgHeightZoomed / 3;

      this.arcs1VertOffset = 0;
      this.arcs2VertOffset = 0;
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

    draw: function() {
      this.context.save();
      var titleImg = this.aLoader.spriteData('banners').image;
      var dashboardImg = this.aLoader.spriteData('dashboard').image;
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

      // draw title
      this.context.drawImage(titleImg, 0, 0, titleImg.width, 68,
          (canvasW / 2) - (titleImg.width / 2 * zoom), (canvasH / 3) - (titleImg.height / 2), titleImg.width * 2, 68 * zoom);

      // draw buttons
      this.playButton.draw(this.context);
      this.rankingButton.draw(this.context);
      this.badgesButton.draw(this.context);
      this.aboutButton.draw(this.context);

      this.context.textAlign = "right";
      this.context.fillStyle = "white";
      this.context.fillText("v. " +this.game.config.version, canvasW, canvasH - 2);
      this.context.restore();
    }

	});
	
	return TitleScene;
})