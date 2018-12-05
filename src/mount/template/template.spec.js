import { getPropsDefinition } from '../component';
import { createTemplate } from '.';

jest.mock('../component', () => ({ getPropsDefinition: jest.fn() }));

describe('Template', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('gets props definition for component', () => {
    getPropsDefinition.mockReturnValue({});

    expect(getPropsDefinition).not.toBeCalled();
    createTemplate('a-component');
    expect(getPropsDefinition).toBeCalledWith('a-component');
  });

  it('creates template for tag by using prop definition', () => {
    getPropsDefinition.mockReturnValue({ prop: '<', anotherProp: '<' });

    const template = createTemplate('a-component');

    expect(template).toBe(
      '<a-component prop="$ctrl.prop" another-prop="$ctrl.anotherProp"></a-component>',
    );
  });

  it('creates template for tag without trailing space when no props', () => {
    getPropsDefinition.mockReturnValue({});

    const template = createTemplate('a-component');

    expect(template).toBe('<a-component></a-component>');
  });
});
