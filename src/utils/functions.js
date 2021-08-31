const clamp01 = (value) => {
  return value < 0 ? 0 : value > 1 ? 1 : value;
};

const objectHasProperty = (object, property) => {
  return Object.prototype.hasOwnProperty.call(object, property);
};

export { clamp01, objectHasProperty };
