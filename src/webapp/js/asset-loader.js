define(['util/observer', 'util/logger'], function(Observer, Logger) {
  var Loader = Observer.extend({

    sprites : {},

    tilesets : {},

    callbackSuccess : null,

    logger : Logger.getLogger('Loader', Logger.Levels.INFO),

    resourcesCount : 0,

    remainingResourcesCount : 0,

    init: function(config) {
      this.config = config;
    },

    addSprite : function (name, extension) {
      this.sprites[name] = {
        image : new Image(),
        extension : extension,
        loaded : false,
        loading : false,
        error : false
      };
      this.resourcesCount++;
    },
    spriteData: function(name) {
      return  this.sprites[name]
    },

    addTileset : function (name) {
      this.tilesets[name] = {
        image : new Image(),
        metadata : null,
        loaded : false,
        metadataLoaded : false,
        imageLoaded : false,
        loading : false,
        error : false,
        tileset : null
      };
      this.resourcesCount++;
    },
    load : function (callback, context) {
      if (this.resourcesCount === 0) {
        this.logger.info('[Loader] No resource to load');
      }
      this.remainingResourcesCount = this.resourcesCount;
      this.callbackSuccess = callback;
      for (var i in this.sprites) {
        this.sprites[i].loading = true;
        this.sprites[i].image.addEventListener('load', (function () {
          var name = i;
          return function () {
            this.logger.debug('[Loader] Sprite \'' + name + '\' loaded');
            this.sprites[name].loaded = true;
            this.checkAllLoaded();
          }
        })().bind(this));
        this.sprites[i].image.src = this.config.spritesDir + i + "." + this.sprites[i].extension;
      };
      for (var j in this.tilesets) {
        this.tilesets[j].loading = true;
        this.tilesets[j].image.addEventListener('load', (function () {
          var name = j;
          return function () {
            this.logger.debug('[Loader] Tileset \'' + name + '\' loaded');
            this.tilesets[name].imageLoaded = true;
            this.tilesets[name].loaded = this.tilesets[name].metadataLoaded && this.tilesets[name].imageLoaded;
            this.checkAllLoaded();
          }
        })().bind(this));
        this.tilesets[j].image.src = 'tilesets/' + j;
        $.getJSON('tilesets/' + j + '.json', (function () {
          var name = j;
          return function (data) {
            this.logger.debug('[Loader] JSON -', name, ':', data);
            this.tilesets[name].metadata = data;
            this.tilesets[name].metadataLoaded = true;
            this.tilesets[name].loaded = this.tilesets[name].metadataLoaded && this.tilesets[name].imageLoaded;
            this.checkAllLoaded();
          }
        })().bind(this));
      };
    },
    checkAllLoaded : function () {
      for (var i in this.sprites) {
        if (this.sprites[i].loaded == false) {
          return false;
        }
      }
      for (var j in this.tilesets) {
        if (this.tilesets[j].loaded == false) {
          return false;
        }
      }
      this.logger.info('[Loader] ' + this.resourcesCount + ' resource(s) loaded');
      this.callbackSuccess && this.callbackSuccess();
      return true;
    },

    reset : function() {
      this.sprites = {};
      this.tilesets = {};
    }
  });

  return Loader;
});