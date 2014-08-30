require(['app', 'config'], function (App, Config) {
  var app = new App({
    $root: document.getElementById("game"),
    config: Config
  });

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
  }

  initBadgesTest();
});