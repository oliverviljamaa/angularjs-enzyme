import 'angular';
import 'angular-mocks';

import mount from '.';
import { createTemplate } from './template';
import { compile } from './component';
import { validate } from './validation';
import TestElementWrapper from './TestElementWrapper';

jest.mock('./template', () => ({ createTemplate: jest.fn() }));
jest.mock('./component', () => ({ compile: jest.fn() }));
jest.mock('./validation', () => ({ validate: jest.fn() }));
jest.mock(
  './TestElementWrapper',
  () =>
    class {
      constructor(angularElement) {
        this.angularElementForSpec = angularElement;
      }
    },
);
describe('mount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validates by tag', () => {
    expect(validate).not.toBeCalled();
    mount('a-component');
    expect(validate).toBeCalledWith('a-component');
  });

  it('creates template for tag', () => {
    expect(createTemplate).not.toBeCalled();
    mount('a-component');
    expect(createTemplate).toBeCalledWith('a-component');
  });

  it('compiles created template with props', () => {
    const props = { prop: 'Value' };
    createTemplate.mockImplementation(tag => `template for ${tag}`);

    expect(compile).not.toBeCalled();
    mount('a-component', props);
    expect(compile).toBeCalledWith('template for a-component', props);
  });

  it('returns test element wrapper created from angular element', () => {
    const angularElement = { angular: 'element' };
    compile.mockReturnValue(angularElement);

    const component = mount('a-component');

    expect(component).toBeInstanceOf(TestElementWrapper);
    expect(component.angularElementForSpec).toBe(angularElement);
  });
});
