import { Class, Specialisation } from '@/enums';

const statPriority = {
  dps: {
    [Class.DRUID]: {
      [Specialisation.BALANCE]: 'spell',
      [Specialisation.FERAL]: 'melee',
    },
    [Class.HUNTER]: {
      [Specialisation.BEASTMASTERY]: 'ranged',
      [Specialisation.MARKSMANSHIP]: 'ranged',
      [Specialisation.SURVIVAL]: 'ranged',
    },
    [Class.MAGE]: {
      [Specialisation.ARCANE]: 'spell',
      [Specialisation.FIRE]: 'spell',
      [Specialisation.FROST]: 'spell',
    },
    [Class.PALADIN]: {
      [Specialisation.RETRIBUTION]: 'melee',
    },
    [Class.PRIEST]: {
      [Specialisation.DISCIPLINE]: 'spell',
      [Specialisation.SHADOW]: 'spell',
    },
    [Class.ROGUE]: {
      [Specialisation.ASSASSINATION]: 'melee',
      [Specialisation.COMBAT]: 'melee',
      [Specialisation.SUBTLETY]: 'melee',
    },
    [Class.SHAMAN]: {
      [Specialisation.ELEMENTAL]: 'spell',
      [Specialisation.ENHANCEMENT]: 'melee',
    },
    [Class.WARLOCK]: {
      [Specialisation.AFFLICTION]: 'spell',
      [Specialisation.DEMONOLOGY]: 'spell',
      [Specialisation.DESTRUCTION]: 'spell',
    },
    [Class.WARRIOR]: {
      [Specialisation.ARMS]: 'melee',
      [Specialisation.FURY]: 'melee',
    },
  },
};

export { statPriority };
