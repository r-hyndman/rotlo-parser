const Role = Object.freeze({
  HEALER: 'Healer',
  MELEE: 'Melee',
  RANGED: 'Ranged',
  SPELL: 'Spell',
  TANK: 'Tank',
});

const Class = Object.freeze({
  DRUID: 'Druid',
  HUNTER: 'Hunter',
  MAGE: 'Mage',
  PALADIN: 'Paladin',
  PRIEST: 'Priest',
  ROGUE: 'Rogue',
  SHAMAN: 'Shaman',
  WARLOCK: 'Warlock',
  WARRIOR: 'Warrior',
});

const Specialisation = Object.freeze({
  AFFLICTION: 'Affliction',
  ARCANE: 'Arcane',
  ARMS: 'Arms',
  ASSASSINATION: 'Assassination',
  BALANCE: 'Balance',
  BEASTMASTERY: 'BeastMastery',
  COMBAT: 'Combat',
  DEMONOLOGY: 'Demonology',
  DESTRUCTION: 'Destruction',
  DISCIPLINE: 'Discipline',
  ELEMENTAL: 'Elemental',
  ENHANCEMENT: 'Enhancement',
  FERAL: 'Feral',
  FIRE: 'Fire',
  FROST: 'Frost',
  FURY: 'Fury',
  HOLY: 'Holy',
  MARKSMANSHIP: 'Marksmanship',
  PROTECTION: 'Protection',
  RESTORATION: 'Restoration',
  RETRIBUTION: 'Retribution',
  SHADOW: 'Shadow',
  SUBTELTY: 'Subtlety',
  SURVIVAL: 'Survival',
});

const SpecialisationRoleMap = Object.freeze({
  [Specialisation.AFFLICTION]: Role.SPELL,
  [Specialisation.ARCANE]: Role.SPELL,
  [Specialisation.ARMS]: Role.MELEE,
  [Specialisation.ASSASSINATION]: Role.MELEE,
  [Specialisation.BALANCE]: Role.SPELL,
  [Specialisation.BEASTMASTERY]: Role.RANGED,
  [Specialisation.COMBAT]: Role.MELEE,
  [Specialisation.DEMONOLOGY]: Role.SPELL,
  [Specialisation.DESTRUCTION]: Role.SPELL,
  [Specialisation.DISCIPLINE]: Role.SPELL,
  [Specialisation.ELEMENTAL]: Role.SPELL,
  [Specialisation.ENHANCEMENT]: Role.MELEE,
  [Specialisation.FERAL]: Role.MELEE,
  [Specialisation.FIRE]: Role.SPELL,
  [Specialisation.FROST]: Role.SPELL,
  [Specialisation.FURY]: Role.MELEE,
  [Specialisation.HOLY]: Role.HEALER,
  [Specialisation.MARKSMANSHIP]: Role.RANGED,
  [Specialisation.PROTECTION]: Role.TANK,
  [Specialisation.RESTORATION]: Role.HEALER,
  [Specialisation.RETRIBUTION]: Role.MELEE,
  [Specialisation.SHADOW]: Role.SPELL,
  [Specialisation.SUBTELTY]: Role.MELEE,
  [Specialisation.SURVIVAL]: Role.RANGED,
});

const ClassRoleMap = Object.freeze({
  [Class.DRUID]: [Role.HEALER, Role.MELEE, Role.SPELL, Role.TANK],
  [Class.HUNTER]: [Role.RANGED],
  [Class.MAGE]: [Role.SPELL],
  [Class.PALADIN]: [Role.HEALER, Role.MELEE, Role.TANK],
  [Class.PRIEST]: [Role.HEALER, Role.SPELL],
  [Class.ROGUE]: [Role.MELEE],
  [Class.SHAMAN]: [Role.HEALER, Role.MELEE, Role.SPELL],
  [Class.WARLOCK]: [Role.SPELL],
  [Class.WARRIOR]: [Role.MELEE, Role.TANK],
});

const ClassSpecialisationMap = Object.freeze({
  [Class.DRUID]: [
    Specialisation.BALANCE,
    Specialisation.FERAL,
    Specialisation.RESTORATION,
  ],
  [Class.HUNTER]: [
    Specialisation.BEASTMASTERY,
    Specialisation.MARKSMANSHIP,
    Specialisation.SURVIVAL,
  ],
  [Class.MAGE]: [
    Specialisation.ARCANE,
    Specialisation.FIRE,
    Specialisation.FROST,
  ],
  [Class.PALADIN]: [
    Specialisation.HOLY,
    Specialisation.PROTECTION,
    Specialisation.RETRIBUTION,
  ],
  [Class.PRIEST]: [
    Specialisation.DISCIPLINE,
    Specialisation.HOLY,
    Specialisation.SHADOW,
  ],
  [Class.ROGUE]: [
    Specialisation.ASSASSINATION,
    Specialisation.COMBAT,
    Specialisation.SUBTELTY,
  ],
  [Class.SHAMAN]: [
    Specialisation.ELEMENTAL,
    Specialisation.ENHANCEMENT,
    Specialisation.RESTORATION,
  ],
  [Class.WARLOCK]: [
    Specialisation.AFFLICTION,
    Specialisation.DEMONOLOGY,
    Specialisation.DESTRUCTION,
  ],
  [Class.WARRIOR]: [
    Specialisation.ARMS,
    Specialisation.FURY,
    Specialisation.PROTECTION,
  ],
});

const RoleClassMap = Object.freeze({
  [Role.HEALER]: [
    Class.DRUID,
    Class.PALADIN,
    Class.PRIEST,
    Class.SHAMAN,
  ],
  [Role.RANGED]: [Class.HUNTER],
  [Role.SPELL]: [
    Class.DRUID,
    Class.HUNTER,
    Class.MAGE,
    Class.PRIEST,
    Class.SHAMAN,
    Class.WARLOCK,
  ],
  [Role.MELEE]: [
    Class.DRUID,
    Class.PALADIN,
    Class.ROGUE,
    Class.SHAMAN,
    Class.WARRIOR,
  ],
  [Role.TANK]: [Class.DRUID, Class.PALADIN, Class.WARRIOR],
});

export {
  Role,
  Class,
  Specialisation,
  ClassSpecialisationMap,
  SpecialisationRoleMap,
  ClassRoleMap,
  RoleClassMap,
};
