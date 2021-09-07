import {
  Class,
  ClassSpecialisationMap,
  Specialisation,
  SpecialisationRoleMap,
} from '@/enums';
import { Spec } from '@/models';

const clamp01 = (value) => {
  return value < 0 ? 0 : value > 1 ? 1 : value;
};

const objectHasKey = (object, key) => {
  return Object.prototype.hasOwnProperty.call(object, key);
};

const tryAddObjectProperty = (object, key, value) => {
  if (!objectHasKey(object, key)) {
    object[key] = value;
    return true;
  }

  return false;
};

const determinePlayerRole = (player) => {
  return SpecialisationRoleMap[
    Object.values(Specialisation).find(
      (spec) => spec === player.specs[0]
    )
  ];
};

const getClassFromString = (classString) => {
  return Class[classString.toUpperCase()];
};

const getSpecFromString = (classString, specString) => {
  for (let [playerClass, specArray] of Object.entries(
    ClassSpecialisationMap
  )) {
    specString =
      classString === 'Warrior'
        ? 'Protection'
        : classString === 'Druid'
        ? 'Feral'
        : specString;

    if (
      playerClass === classString &&
      specArray.includes(specString)
    ) {
      return new Spec({
        name: Specialisation[specString.toUpperCase()],
        icon: `${playerClass}/${specString}.png`.toLowerCase(),
      });
    }
  }
};

export {
  clamp01,
  determinePlayerRole,
  getClassFromString,
  getSpecFromString,
  objectHasKey,
  tryAddObjectProperty,
};
