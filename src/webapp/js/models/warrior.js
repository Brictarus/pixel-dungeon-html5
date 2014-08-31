define(['models/hero'], function (Hero) {
  var Warrior = Hero.extend({
  });

  Warrior.description = '- Warriors start with 11 points of Strength.\n' +
    '- Warriors start with a unique short sword. This sword can be later "reforged" to upgrade another melee weapon.\n' +
    '- Warriors are less proficient with missile weapons.\n' +
    '- Any piece of food restores some health when eaten.\n' +
    '- Potions of Strength are identified from the beginning.';

  return Warrior;
});
