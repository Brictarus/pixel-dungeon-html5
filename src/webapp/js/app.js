define(['util/observer', 'util/dom-helper', 'asset-loader', 'scenes/title-scene'],
    function(Observer, DomHelper, AssetLoader, TitleScene) {

  var Game = Observer.extend({
    init: function(options) {
      this.config = options.config;
      this.$root = options.$root;
      this.createCanvases();
      this.currScene = "HOME";
      this.draw();
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

    draw: function() {
      this.context.save();
      this.context.strokeStyle = "blue";

      var canvasW = this.$canvas.width,
          canvasH = this.$canvas.height;
      var zoom = 2;
      if (this.currScene == "HOME") {
        new TitleScene({
          game: this,
          zoom: zoom,
          height: canvasH,
          width: canvasW,
          context: this.context
        });
      }
    }
  });

  return Game;
});