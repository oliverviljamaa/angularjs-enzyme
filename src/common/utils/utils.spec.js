import { compose, convertKebabCaseToCamelCase } from '.';

describe('Utils', () => {
  describe('compose', () => {
    it('applies functions to data argument in order', () => {
      const string = '0';
      const append1 = str => `${str}1`;
      const append2 = str => `${str}2`;

      const result = compose(
        append1,
        append2,
      )(string);

      expect(result).toBe('021');
    });
  });

  describe('converting kebab-case to camel-case', () => {
    it('converts kebab-case to camel-case', () => {
      expect(convertKebabCaseToCamelCase('side-navigation')).toBe('sideNavigation');
    });

    it('keeps already camel-case the same', () => {
      expect(convertKebabCaseToCamelCase('sideNavigation')).toBe('sideNavigation');
    });
  });
});
