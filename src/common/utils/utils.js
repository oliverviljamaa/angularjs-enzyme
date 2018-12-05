export const compose = (...functions) => functions.reduce((f, g) => (...args) => f(g(...args)));

export const convertKebabCaseToCamelCase = string =>
  string.replace(/(-\w)/g, m => m[1].toUpperCase());

export const convertCamelCaseToKebabCase = string =>
  string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
