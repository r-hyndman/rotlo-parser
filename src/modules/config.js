import config from '../../config.json';

const getConfig = (key) => {
  return config[key];
};

export { getConfig };
