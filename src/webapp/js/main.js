require(['app', 'config', 'lib/stats'], function (App, Config, Stats) {
  var app = new App({
    $root: document.getElementById("game"),
    config: Config
  });
	
	window.stats = new Stats();
	stats.setMode(0);
	document.body.appendChild( stats.domElement );
	stats.domElement.style.position = "absolute";
	stats.domElement.style.top = "0";

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