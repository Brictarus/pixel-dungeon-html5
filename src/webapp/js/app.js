define(['util/observer', 'util/dom-helper', 'asset-loader', 'scenes/title-scene', 'scenes/about-scene',
        'scenes/badges-scene', 'scenes/rankings-scene', 'scenes/game-scene', 'scenes/hero-selection-scene', 'util/logger'],
    function(Observer, DomHelper, AssetLoader, TitleScene, AboutScene, BadgesScene, RankingsScene, GameScene, HeroSelectionScene, Logger) {

  var Game = Observer.extend({
    logger : Logger.getLogger('Loader', Logger.Levels.DEBUG),

    init: function(options) {
      this.config = options.config;
      this.$root = options.$root;
      this.size = options.size;
      this.currentScene = null;
      this.started = false;
      this.zoom = 2.0;
      this.createCanvases();
      this.attachMouseEvents();
      this.changeScene({ sceneName: "TITLE"});
      /*this.changeScene({ sceneName: "ABOUT"});*/
      this.start();
    },

    attachMouseEvents: function () {
      this.$root.addEventListener("mousedown", (this.onMouseDown).bind(this));
      window.addEventListener("mouseup", (this.onMouseUp).bind(this));
    },

    onMouseDown: function(mouseEvent) {
      var x = (mouseEvent.pageX - this.$root.offsetLeft) / this.ratio,
          y = (mouseEvent.pageY - this.$root.offsetTop) / this.ratio;
      this.logger.debug("x = ", x, "y = ", y, mouseEvent);
      if (this.currentScene != null) {
        this.currentScene.onMouseDown(x, y, mouseEvent);
      }
    },

    onMouseUp: function(mouseEvent) {
      var x = (mouseEvent.pageX - this.$root.offsetLeft) / this.ratio,
          y = (mouseEvent.pageY - this.$root.offsetTop) / this.ratio;
      this.logger.debug("x = ", x, "y = ", y, mouseEvent);
      if (this.currentScene != null) {
        this.currentScene.onMouseUp(x, y, mouseEvent);
      }
    },

    createCanvases: function() {
      // first delete all existing children, if any
      var $r = this.$root;
      while ($r.firstChild) {
        $r.removeChild($r.firstChild);
      }

      var layout = "VERTICAL";
      // append canvases
      // w: 500 x h : 320
      var verticalRatio = 0.64;
      // w: 300 x h : 150
      var horizontalRatio = 1/verticalRatio;
      var $canvas = document.createElement("canvas");
      this.ratio = 0;
      if (layout == "VERTICAL") {
        $canvas.width = 160 * this.zoom;
        $canvas.height = 250 * this.zoom;
        var tempWidth = parseInt(verticalRatio * this.size.h);
        if (tempWidth <= this.size.w) {
          $canvas.style.width = tempWidth + "px";
          $canvas.style.height = this.size.h + "px";
          this.ratio = this.size.h / $canvas.height;
        } else {
          $canvas.style.width = Math.min(tempWidth, this.size.w) + "px";
          this.ratio = this.size.w / $canvas.width;
        }
      } else {
        $canvas.width = 250 * this.zoom;
        $canvas.height = 160 * this.zoom;
        var tempHeight = parseInt(verticalRatio * this.size.w);
        if (tempHeight <= this.size.h) {
          $canvas.style.width = this.size.w + "px";
          $canvas.style.heigth = tempHeight + "px";
          this.ratio = this.size.w / $canvas.width;
        } else {
          $canvas.style.height = Math.min(tempHeight, this.size.h) + "px";
          $canvas.style.width = Math.min(tempHeight, this.size.h) * horizontalRatio + "px";
          this.ratio = this.size.h / $canvas.height;
        }
      }
      this.logger.debug('ratio =', this.ratio);
      $r.style.width = $canvas.style.width;


      // 300w * 550h
      $r.appendChild($canvas);

      this.$canvas = $canvas;
      this.context = $canvas.getContext("2d");
    },

    start: function() {
      this.started = true;
      this.step();
    },

    stop: function() {
      this.started = false;
    },

    step: function() {
      window.stats && window.stats.begin();
      if (this.currentScene) {
        this.currentScene.clearContext();
        this.currentScene._update();
        this.currentScene._draw();
      }
      if (this.started) {
        requestAnimationFrame(this.step.bind(this), null);
      }
      window.stats && window.stats.end();
    },

    changeScene: function (data) {
      if (this.currentScene) {
        this.currentScene.clear && this.currentScene.clear();
      }
      this.state = data.sceneName;

      var canvasW = this.$canvas.width,
          canvasH = this.$canvas.height;
      var sceneOptions = {
        game: this,
        height: canvasH,
        width: canvasW,
        context: this.context,
        zoom: this.zoom
      };
      if (data && data.arcsData) {
        sceneOptions.arcsData = data.arcsData;
      }
      switch (this.state) {
        case "TITLE":
          this.currentScene = new TitleScene(sceneOptions);
          break;
        case "ABOUT":
          this.currentScene = new AboutScene(sceneOptions)
          break;
        case "RANKINGS":
          this.currentScene = new RankingsScene(sceneOptions)
          break;
        case "BADGES":
          this.currentScene = new BadgesScene(sceneOptions)
          break;
        case "GAME":
          this.currentScene = new GameScene(sceneOptions)
          break;
        case "HERO_SELECTION":
          this.currentScene = new HeroSelectionScene(sceneOptions)
          break;
        default:
          this.currentScene = null;
      }
    }
  });

  return Game;
});