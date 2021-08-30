const statPriority = {
  dps: {
    druid: {
      balance: 'spell',
      feral: 'melee',
    },
    hunter: {
      beastmastery: 'ranged',
      marksmanship: 'ranged',
      survival: 'ranged',
    },
    mage: {
      arcane: 'spell',
      fire: 'spell',
      frost: 'spell',
    },
    paladin: {
      retribution: 'melee',
    },
    priest: {
      discipline: 'spell',
      shadow: 'spell',
    },
    rogue: {
      assassination: 'melee',
      combat: 'melee',
      subtlety: 'melee',
    },
    shaman: {
      elemental: 'spell',
      enhancement: 'melee',
    },
    warlock: {
      affliction: 'spell',
      demonology: 'spell',
      destruction: 'spell',
    },
    warrior: {
      arms: 'melee',
      fury: 'melee',
    },
  },
};

export { statPriority };
