import 'angular';
import 'angular-mocks';

import TestElementWrapper from '.';
import mount from '..';

jest.mock('../../mockComponent', () => jest.fn());

describe('Test element wrapper', () => {
  describe('length', () => {
    it('is how many elements are in wrapper', () => {
      const wrapper = mount(`
        <main>
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </main>
      `);

      const buttons = wrapper.find('li');

      expect(buttons.length).toBe(3);
    });
  });

  describe('html', () => {
    it('returns html without container element', () => {
      const wrapper = mount(`
        <main>
          <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </main>
      `);

      const html = trimWhitespace(wrapper.html());
      const expectedHtml = trimWhitespace(`
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      `);

      expect(html).toBe(expectedHtml);
    });
  });

  describe('text', () => {
    it('returns text', () => {
      const wrapper = mount(`
        <main>
          <h2>Some title</h2>
          <p>Some text</p>
        </main>
      `);
      const text = trimWhitespace(wrapper.text());

      expect(text).toBe('Some title Some text');
    });
  });

  describe('hasClass', () => {
    let button;
    beforeEach(() => {
      const wrapper = mount(`
        <main>
          <button class="success">Pay</button>
        </main>
      `);
      button = wrapper.find('button');
    });

    it('returns true if wrapper has class', () => {
      expect(button.hasClass('success')).toBe(true);
    });

    it('returns false if wrapper does not have class', () => {
      expect(button.hasClass('error')).toBe(false);
    });
  });

  describe('exists', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mount(`
        <main>
          <button class="success">Pay</button>
        </main>
      `);
    });

    it('returns true when one or more elements exist', () => {
      expect(wrapper.find('button').exists()).toBe(true);
    });

    it('returns false when no elements exist', () => {
      expect(wrapper.find('a').exists()).toBe(false);
    });
  });

  describe('find', () => {
    it('allows finding by any selector', () => {
      const wrapper = mount(`
      <main>
        <div class="wrong">
          <a href="https://right.com">
            Wrong
          </a>
        </div>
        <div class="right">
          <a href="https://wrong.com">
            Wrong
          </a>
        </div>
        <div class="right">
          <a href="https://right.com">
            Right
          </a>
        </div>
      </main>
    `);

      const text = wrapper
        .find('.right a[href="https://right.com"]')
        .text()
        .trim();

      expect(text).toBe('Right');
    });

    it('returns test element wrapper for chaining', () => {
      const wrapper = mount(`
        <main>
          <a href="/link">Some title</a>
        </main>
      `);
      const links = wrapper.find('a');

      expect(links).toBeInstanceOf(TestElementWrapper);
    });
  });

  describe('at', () => {
    it('returns wrapper for element at index', () => {
      const wrapper = mount(`
      <main>
        <input type="radio" name="radio" value="first">
        <input type="radio" name="radio" value="second">
        <input type="radio" name="radio" value="third">
      </main>
    `);

      const thirdInput = wrapper.find('input').at(2);
      expect(thirdInput.prop('value')).toBe('third');
    });

    it('returns zero-length wrapper when index is out of range', () => {
      const wrapper = mount(`
      <main>
        <input type="radio" name="radio" value="first">
        <input type="radio" name="radio" value="second">
        <input type="radio" name="radio" value="third">
      </main>
    `);

      const fourthInput = wrapper.find('input').at(3);
      expect(fourthInput.length).toBe(0);
    });
  });

  describe('map', () => {
    it('maps over elements', () => {
      const wrapper = mount(`
        <main>
          <ul>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
          </ul>
        </main>
      `);

      const items = wrapper.find('li');

      expect(items.map(item => item.text())).toEqual(['One', 'Two', 'Three']);
    });
  });

  describe('props', () => {
    it('returns props', () => {
      const wrapper = mount(`
        <main>
          <a href="https://transferwise.com" target="_blank">Send money</a>
        </main>
      `);

      const link = wrapper.find('a');

      expect(link.props()).toEqual({ href: 'https://transferwise.com', target: '_blank' });
    });
  });

  describe('prop', () => {
    it('returns prop with key', () => {
      const wrapper = mount(`
        <main>
          <a href="https://transferwise.com" target="_blank">Send money</a>
        </main>
      `);

      const link = wrapper.find('a');

      expect(link.prop('href')).toBe('https://transferwise.com');
    });
  });

  describe('simulate', () => {
    let wrapper;
    let onClick;
    beforeEach(() => {
      onClick = jest.fn();
      wrapper = mount(
        `
          <main>
            <input ng-model="$ctrl.text" />
            <p>{{ $ctrl.text }}</p>
            <button ng-click="$ctrl.onClick($ctrl.text)">Click me</button>
          </main>
        `,
        { text: 'Original text', onClick },
      );
    });

    it('simulates event', () => {
      const button = wrapper.find('button');

      expect(onClick).not.toBeCalled();
      button.simulate('click');
      expect(onClick).toBeCalledWith('Original text');
    });

    it('returns wrapper itself for chaining', () => {
      const button = wrapper.find('button');

      expect(button.simulate('click')).toBe(button);
    });

    describe('for change', () => {
      it('simulates change', () => {
        const input = wrapper.find('input');

        expect(wrapper.find('p').text()).toBe('Original text');
        input.simulate('change', { target: { value: 'New text' } });
        expect(wrapper.find('p').text()).toBe('New text');
      });

      it('throws error when data does not have proper event format', () => {
        const input = wrapper.find('input');

        expect(() => {
          input.simulate('change', 'not an event format');
        }).toThrowError();
      });
    });
  });

  describe('setProps', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mount(
        `
          <main>
            <h1>{{ $ctrl.title }}</h1>
            <p>{{ $ctrl.text }}</p>
          </main>
        `,
        { title: 'Original title', text: 'Original text' },
      );
    });

    it('sets props and updates view to reflect them', () => {
      const title = () => wrapper.find('h1').text();
      const text = () => wrapper.find('p').text();

      expect(title()).toBe('Original title');
      expect(text()).toBe('Original text');
      wrapper.setProps({ title: 'New title', text: 'New text' });
      expect(title()).toBe('New title');
      expect(text()).toBe('New text');
    });

    it('returns wrapper itself for chaining', () => {
      expect(wrapper.setProps({ title: 'New title' })).toBe(wrapper);
    });
  });
});

function trimWhitespace(text) {
  return text.trim().replace(/\s+/g, ' ');
}
