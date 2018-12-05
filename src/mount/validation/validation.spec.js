import { validate } from '.';
import { getPropsDefinition } from '../component';
import AngularjsEnzymeError from './AngularjsEnzymeError';

jest.mock('../component', () => ({ getPropsDefinition: jest.fn() }));

describe('Validation', () => {
  it('passes when no one-way bound props exist', () => {
    getPropsDefinition.mockReturnValue({ prop: '<', anotherProp: '<' });

    expect(() => {
      validate('a-component');
    }).not.toThrow();
  });

  it('fails when any not one-way bound prop exists', () => {
    getPropsDefinition.mockReturnValue({ prop: '<', anotherProp: '&' });

    expect(() => {
      validate('a-component');
    }).toThrow(AngularjsEnzymeError);
  });
});
