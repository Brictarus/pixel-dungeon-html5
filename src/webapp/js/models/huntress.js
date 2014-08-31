define(['models/hero'], function (Hero) {
  var Huntress = Hero.extend({
  });

  Huntress.description = '- Huntresses start with 15 points of Health.\n' +
    '- Huntresses start with a unique upgradeable boomerang.\n' +
    '- Huntresses are proficient with missile weapons and get damage bonus for excessive strength when using them.\n' +
    '- Huntresses gain more health from dewdrops.\n' +
    '- Huntresses sens neighbouring monsters even if they are hidden behind obstacles.';

  return Huntress;
});
