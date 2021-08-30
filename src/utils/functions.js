const objectHasProperty = (object, property) => {
  return Object.prototype.hasOwnProperty.call(object, property);
};

export { objectHasProperty };
