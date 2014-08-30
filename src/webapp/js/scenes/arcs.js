define(['util/class'], function(Class) {
   var Arcs = Class.extend({
     init: function(options) {
       this.arcs1Img = options.arcs1Asset.image;
       this.arcs2Img = options.arcs2Asset.image;
       this.arcs1VertOffset = options.arcs1VertOffset || 0;
       this.arcs2VertOffset = options.arcs2VertOffset || 0;
       this.zoom = options.zoom || 1;
       this.size = options.size;

       this.arcs1ImgWidthZoomed = this.arcs1Img.width * this.zoom;
       this.arcs1ImgHeightZoomed = this.arcs1Img.height * this.zoom;
       this.arcs2ImgWidthZoomed = this.arcs2Img.width * this.zoom;
       this.arcs2ImgHeightZoomed = this.arcs2Img.height * this.zoom;

       this.arcs1HorizOffset = this.arcs1ImgHeightZoomed / 3;

       this.arcs1VertSpeed = 0.5;
       this.arcs2VertSpeed = 1;
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

     draw: function(context) {
       context.save();

       var arcs1Img = this.arcs1Img;
       var arcs2Img = this.arcs2Img;
       var canvasW = this.size.w,
           canvasH = this.size.h,
           zoom = this.zoom;

       // draw arcs
       var arcs1WidthCount = Math.ceil(canvasW / (arcs1Img.width * zoom));
       var arcs1HeightCount = Math.ceil(canvasH / (arcs1Img.height * zoom));
       for (var iArcs1 = 0; iArcs1 <= arcs1WidthCount; iArcs1++) {
         for (var jArcs1 = 0; jArcs1 <= arcs1HeightCount; jArcs1++) {
           context.drawImage(arcs1Img, 0, 0, arcs1Img.width, arcs1Img.height,
               (iArcs1 * this.arcs1ImgWidthZoomed) - this.arcs1HorizOffset, (jArcs1 * arcs1Img.height * zoom) + this.arcs1VertOffset, this.arcs1ImgWidthZoomed, this.arcs1ImgHeightZoomed);
         }
       }
       var arcs2WidthCount = Math.ceil(canvasW / (arcs2Img.width * zoom));
       var arcs2HeightCount = Math.ceil(canvasH / (arcs2Img.height * zoom));
       for (var iArcs2 = 0; iArcs2 < arcs2WidthCount; iArcs2++) {
         for (var jArcs2 = 0; jArcs2 <= arcs2HeightCount; jArcs2++) {
           context.drawImage(arcs2Img, 0, 0, arcs2Img.width, arcs2Img.height,
               (iArcs2 * this.arcs2ImgWidthZoomed), (jArcs2 * this.arcs2ImgHeightZoomed) + this.arcs2VertOffset, this.arcs2ImgWidthZoomed, this.arcs2ImgHeightZoomed);
         }
       }

       context.restore();
     }
   });

  return Arcs;
});