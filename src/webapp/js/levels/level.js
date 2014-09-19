define(['util/class', 'levels/terrain'], function(Class, Terrain) {
  var Level = Class.extend({
    draw: function(context, camera) {
      context.save();
      var x, y, w, h;
      w = h = 16 * 2;
      if (this.map) {
        for(var i = 0; i < this.map.length; i++) {
          var color = '#000';
          switch(this.map[i]) {
            case Terrain.WALL:
              color = '#888'; break;
            case Terrain.EMPTY:
              color = '#55F'; break;
          }
          context.fillStyle = color;
          x = (i % this.width) * w;
          y = parseInt(i / this.width) * h;
          context.fillRect(x, y, w, h);
        }
      }
      context.restore();
    }
  });
  return Level;
})