define(['util/observer', 'util/dom-helper', 'asset-loader', 'scenes/title-scene', 'scenes/about-scene',
        'scenes/badges-scene', 'scenes/rankings-scene', 'scenes/game-scene', 'scenes/hero-selection-scene', 'util/logger'],
    function(Observer, DomHelper, AssetLoader, TitleScene, AboutScene, BadgesScene, RankingsScene, GameScene, HeroSelectionScene, Logger) {

  var Game = Observer.extend({
    logger : Logger.getLogger('Loader', Logger.Levels.INFO),

    init: function(options) {
      this.config = options.config;
      this.$root = options.$root;
      this.currentScene = null;
      this.started = false;
      this.createCanvases();
      this.attachMouseEvents();
      this.changeScene({ sceneName: "TITLE"});
      /*this.changeScene({ sceneName: "RANKINGS"});*/
      this.start();
    },

    attachMouseEvents: function () {
      this.$root.addEventListener("mousedown", (this.onMouseDown).bind(this));
      window.addEventListener("mouseup", (this.onMouseUp).bind(this));
    },

    onMouseDown: function(mouseEvent) {
      var x = mouseEvent.pageX - this.$root.offsetLeft,
          y = mouseEvent.pageY - this.$root.offsetTop;
      this.logger.debug("x = ", x, "y = ", y, mouseEvent);
      if (this.currentScene != null) {
        this.currentScene.onMouseDown(x, y, mouseEvent);
      }
    },

    onMouseUp: function(mouseEvent) {
      var x = mouseEvent.pageX - this.$root.offsetLeft,
          y = mouseEvent.pageY - this.$root.offsetTop;
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

      // append canvases
      var $canvas = document.createElement("canvas");
      var rootPosY = Math.ceil(document.getElementById("game").getBoundingClientRect().top);
      var rootStyle = getComputedStyle($r);
      var borderTop = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'border-top-width');
      var borderBottom = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'border-bottom-width');
      var marginTop = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'margin-top');
      var marginBottom = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'margin-bottom');
      var paddingTop = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'padding-top');
      var paddingBottom = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'padding-bottom');
      var deltaSpaceContainer = (borderBottom + borderTop + marginBottom + marginTop + paddingBottom + paddingTop);
      var canvasHeight = window.innerHeight - rootPosY - 5 - deltaSpaceContainer;
      $canvas.height = canvasHeight;
      $canvas.width = 300;
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
      var zoom = 2;
      var sceneOptions = {
        game: this,
        zoom: zoom,
        height: canvasH,
        width: canvasW,
        context: this.context
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