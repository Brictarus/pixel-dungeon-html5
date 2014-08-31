define(['models/hero'], function (Hero) {
  var Rogue = Hero.extend({
  });

  Rogue.description = '- Rogues start with a Ring of Shadows + 1.\n' +
    '- Rogues identify a type of a ring on equipping it.\n' +
    '- Rogues are proficient with light armor, dodging better while wearing one.\n' +
    '- Rogues are proficient in detecting hidden doors and traps.\n' +
    '- Rogues can go without food longer.\n' +
    '- Scrolls of Magic Mapping identified from the beginning';

  return Rogue;
});
