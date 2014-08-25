require(['util/observer'], function(Observer) {
  var t = new Observer();
  t.on('test', function () {
      console.log('ceci est mon test');
    }
  );
  t.trigger('test');
});