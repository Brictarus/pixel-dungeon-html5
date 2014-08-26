require(['app', 'config'], function(App, Config) {
  var app = new App({
    $root : document.getElementById("game"),
    config: Config
  });
});