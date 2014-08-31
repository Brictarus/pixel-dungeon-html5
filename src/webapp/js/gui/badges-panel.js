define(['gui/panel', 'gui/badge', 'util/logger'], function (Panel, Badge, Logger) {
  return Panel.extend({

    logger: Logger.getLogger('gui.BadgesPanel', Logger.Levels.INFO),

    init: function (options) {
      this._super(options);
      this.badgesConfig = options.badgesConfig;
      this.badgesImage = options.badgesImage;

      var badges = this.getBadges();
      this.children = badges;
    },

    getBadges: function () {
      var badges = JSON.parse(localStorage.getItem("badges"));
      var badgesDrawable = [];
      var itemHeight = this.badgesConfig.sh * this.zoom + 10;
      var currItemHeight = 2;
      for (var prop in badges) {
        var badgeValue = badges[prop];
        if (badges.hasOwnProperty(prop)) {
          var badgeCategory = this.badgesConfig[prop];
          if (!badgeCategory) {
            this.logger.error("Badge category", prop, "doesn't exist");
          } else if (!badgeCategory[badgeValue]) {
            this.logger.error("Badge", badgeValue, "doesn't exist");
          } else {
            var badgeInfo = badgeCategory[badgeValue];
            badgesDrawable.push(new Badge({
              desc: badgeInfo.desc,
              img: {
                sx: badgeInfo.sx, sy: badgeInfo.sy, sw: this.badgesConfig.sw, sh: this.badgesConfig.sh
              },
              rawImg: this.badgesImage,
              zoom: this.zoom,
              pos: {
                x: this.contentPos.x + 3, y: currItemHeight + this.contentPos.y
              },
							size: {
								w: this.contentSize.w,
								h: itemHeight
							}
            }));
            currItemHeight += itemHeight;
          }
        }
      }
      return badgesDrawable;
    }
  });
});