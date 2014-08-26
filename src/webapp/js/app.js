define(['util/observer', 'util/dom-helper', 'asset-loader'], function(Observer, DomHelper, AssetLoader) {
  var Game = Observer.extend({
    init: function(options) {
      this.$root = options.$root;
      this.createCanvases();
      this.currScene = "HOME";
      this.assets = {};

      this.aLoader = new AssetLoader(options.config.assetConfig);
      this.aLoader.addSprite("banners", "png");
      this.aLoader.addSprite("dashboard", "png");
      this.aLoader.addSprite("arcs1", "png");
      this.aLoader.addSprite("arcs2", "png");
      this.aLoader.load(this.draw.bind(this));
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
        var titleImg = this.aLoader.spriteData('banners').image;
        var dashboardImg = this.aLoader.spriteData('dashboard').image;
        var arcs1Img = this.aLoader.spriteData('arcs1').image;
        var arcs2Img = this.aLoader.spriteData('arcs2').image;

        // draw arcs
        var arcs1WidthCount = Math.ceil(canvasW / (arcs1Img.width * zoom));
        var arcs1HeightCount = Math.ceil(canvasH / (arcs1Img.height * zoom));
        for (var iArcs1 = 0; iArcs1 < arcs1WidthCount; iArcs1++) {
          for (var jArcs1 = 0; jArcs1 < arcs1HeightCount; jArcs1++) {
            this.context.drawImage(arcs1Img, 0, 0, arcs1Img.width, arcs1Img.height,
                (iArcs1 * arcs1Img.width * zoom), (jArcs1 * arcs1Img.height * zoom), arcs1Img.width * zoom, arcs1Img.height * zoom);
}
        }
        var arcs2WidthCount = Math.ceil(canvasW / (arcs2Img.width * zoom));
        var arcs2HeightCount = Math.ceil(canvasH / (arcs2Img.height * zoom));
        for (var iArcs2 = 0; iArcs2 < arcs2WidthCount; iArcs2++) {
          for (var jArcs2 = 0; jArcs2 < arcs2HeightCount; jArcs2++) {
            this.context.drawImage(arcs2Img, 0, 0, arcs2Img.width, arcs2Img.height,
                (iArcs2 * arcs2Img.width * zoom), (jArcs2 * arcs2Img.height * zoom), arcs2Img.width * zoom, arcs2Img.height * zoom);
          }
        }


        // draw title
        this.context.drawImage(titleImg, 0, 0, titleImg.width, 68,
            (canvasW / 2) - (titleImg.width / 2 * zoom), (canvasH / 3) - (titleImg.height / 2), titleImg.width * 2, 68 * zoom);

        // draw buttons
        this.context.globalAlpha = 0.75;
        this.context.drawImage(dashboardImg, 0, 0, 32, dashboardImg.height,
            60, (canvasH / 3) + (dashboardImg.height / 2) + 30, 32 * zoom, 32 * zoom);
        this.context.drawImage(dashboardImg, 32, 0, 32, dashboardImg.height,
            170, (canvasH / 3) + (dashboardImg.height / 2) + 30, 32 * zoom, 32 * zoom);
        this.context.drawImage(dashboardImg, 64, 0, 32, dashboardImg.height,
            60, (canvasH / 3) + (dashboardImg.height / 2) + 130, 32 * zoom, 32 * zoom);
        this.context.drawImage(dashboardImg, 96, 0, 32, dashboardImg.height,
            170, (canvasH / 3) + (dashboardImg.height / 2) + 130, 32 * zoom, 32 * zoom);
      }
      this.context.restore();
    }
  });

  return Game;
});