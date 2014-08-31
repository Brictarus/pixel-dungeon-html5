require(['app', 'config', 'lib/stats', 'util/dom-helper'], function (App, Config, Stats, DomHelper) {
  var initBadgesTest = function () {
    var badgesKey = "badges";
    var badges = localStorage.getItem(badgesKey);
    if (badges) {
      badges = JSON.parse(badges);
    } else {
      badges = {};
    }
    badges.KILLED = "KILLED_50";
    badges.GOLD = "GOLD_500";
    badges.LEVEL = "LEVEL_6";
    badges.BOSS = "BOSS_1";
    localStorage.setItem(badgesKey, JSON.stringify(badges));
  };

  var getAvailableSize = function($r) {
    var rootPosY = Math.ceil($r.getBoundingClientRect().top);
    var rootPosX = Math.ceil($r.getBoundingClientRect().left);
    var rootStyle = getComputedStyle($r, null);
    var borderTop = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'border-top-width');
    var borderBottom = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'border-bottom-width');
    var marginTop = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'margin-top');
    var marginBottom = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'margin-bottom');
    var paddingTop = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'padding-top');
    var paddingBottom = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'padding-bottom');
    var deltaYContainer = (borderBottom + borderTop + marginBottom + marginTop + paddingBottom + paddingTop);
    var height = window.innerHeight - rootPosY - deltaYContainer; // - 5

    var borderLeft = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'border-left-width');
    var borderRight = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'border-right-width');
    var marginLeft = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'margin-left');
    var marginRight = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'margin-right');
    var paddingLeft = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'padding-left');
    var paddingRight = DomHelper.getWidthPropertyFromComputedStyle(rootStyle, 'padding-right');
    var deltaXContainer = (borderLeft + borderRight + marginLeft + marginRight + paddingLeft + paddingRight);
    var width = window.innerWidth - rootPosX - deltaXContainer; // - 5

    return {w: width, h: height}
  }

  var size = getAvailableSize(document.getElementById("game"));
  console.warn(size);

  var app = new App({
    $root: document.getElementById("game"),
    size: size,
    config: Config
  });

  window.stats = new Stats();
  stats.setMode(0);
  document.body.appendChild(stats.domElement);
  stats.domElement.style.position = "absolute";
  stats.domElement.style.top = "0";
  stats.domElement.style.left = "360px";

  initBadgesTest();
});