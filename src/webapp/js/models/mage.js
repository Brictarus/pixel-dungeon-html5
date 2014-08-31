define(['models/hero'], function (Hero) {
  var Mage = Hero.extend({
  });

  Mage.description = '- Mages start with a unique Wand of Magic Missile. This wand can be later "disenchanted" to upgrade another wand.\n' +
    '- Mages recharge their wands faster.\n' +
    '- When eaten, any piece of food restores 1 charge for all wands in the inventory.\n' +
    '- Mages can use wands as a melee weapon.\n' +
    '- Scrolls of Identity are identified from the beginning.';

  return Mage;
});
