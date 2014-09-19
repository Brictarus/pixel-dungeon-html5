define(['util/logger', 'scenes/base-scene', 'levels/level', 'levels/test-level'],
    function (Logger, BaseScene, Level, TestLevel) {
      var AboutScene = BaseScene.extend({
        logger: Logger.getLogger('scenes.RankingsScene', Logger.Levels.INFO),

        init: function (options) {
          this._super(options);

          this.initScene();
        },

        initScene: function () {
          this.level = new Level();
          this.level.map = TestLevel.map;
          this.level.width = TestLevel.WIDTH;
          this.level.height = TestLevel.HEIGHT;
          this.level.length = TestLevel.LENGTH;
          this.ready = true;
        },

        update: function () {
        },

        draw: function () {
          if (this.level) {
            this.level.draw(this.context);
          }
        }

      });

      return AboutScene;
    }
);