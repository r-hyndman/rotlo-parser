const Role = Object.freeze({
  HEALER: 'Healer',
  MELEE: 'Melee',
  RANGED: 'Ranged',
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
  BEASTMASTERY: 'Beastmastery',
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
  [Specialisation.AFFLICTION]: Role.RANGED,
  [Specialisation.ARCANE]: Role.RANGED,
  [Specialisation.ARMS]: Role.MELEE,
  [Specialisation.ASSASSINATION]: Role.MELEE,
  [Specialisation.BALANCE]: Role.RANGED,
  [Specialisation.BEASTMASTERY]: Role.RANGED,
  [Specialisation.COMBAT]: Role.MELEE,
  [Specialisation.DEMONOLOGY]: Role.RANGED,
  [Specialisation.DESTRUCTION]: Role.RANGED,
  [Specialisation.DISCIPLINE]: Role.HEALER,
  [Specialisation.ELEMENTAL]: Role.RANGED,
  [Specialisation.ENHANCEMENT]: Role.MELEE,
  [Specialisation.FERAL]: Role.MELEE,
  [Specialisation.FIRE]: Role.RANGED,
  [Specialisation.FROST]: Role.RANGED,
  [Specialisation.FURY]: Role.MELEE,
  [Specialisation.HOLY]: Role.HEALER,
  [Specialisation.MARKSMANSHIP]: Role.RANGED,
  [Specialisation.PROTECTION]: Role.TANK,
  [Specialisation.RESTORATION]: Role.HEALER,
  [Specialisation.RETRIBUTION]: Role.MELEE,
  [Specialisation.SHADOW]: Role.RANGED,
  [Specialisation.SUBTELTY]: Role.MELEE,
  [Specialisation.SURVIVAL]: Role.RANGED,
});

const ClassRoleMap = Object.freeze({
  [Class.DRUID]: [Role.HEALER, Role.MELEE, Role.RANGED, Role.TANK],
  [Class.HUNTER]: [Role.RANGED],
  [Class.MAGE]: [Role.RANGED],
  [Class.PALADIN]: [Role.HEALER, Role.MELEE, Role.TANK],
  [Class.PRIEST]: [Role.HEALER, Role.RANGED],
  [Class.ROGUE]: [Role.MELEE],
  [Class.SHAMAN]: [Role.HEALER, Role.MELEE, Role.RANGED],
  [Class.WARLOCK]: [Role.RANGED],
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
  [Role.RANGED]: [
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
