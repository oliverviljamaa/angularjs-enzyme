import 'angular';
import 'angular-mocks';
import TestElementWrapper from '.';

describe('Test element wrapper', () => {
  const callback = jest.fn();
  const TEMPLATE = `
      <main>
        <p class="first">Some text</p>
        <div>
          <button class="first" ng-click="$ctrl.callback()">Click me</button>
          <button class="second">Or me</button>
          <a href="https://transferwise.com" target="_blank">Or even me</a>
        </div>
      </main>
    `;

  let wrapper;
  beforeEach(() => {
    angular.module('some-module', []).component('someComponent', {
      template: `
        <h1>{{ $ctrl.title }}</h1>
        <p>{{ $ctrl.text }}</p>
      `,
      bindings: { title: '<', text: '<' },
    });
    angular.mock.module('some-module');

    wrapper = new TestElementWrapper(getAngularElement(TEMPLATE));
  });

  describe('length', () => {
    it('is how many nodes are in wrapper', () => {
      const button = wrapper.find('button');
      expect(button).toHaveLength(2);
    });
  });

  describe('html', () => {
    it('returns wrapper html without container element', () => {
      const html = trimWhitespace(wrapper.html());
      const expectedHtml = trimWhitespace(`
        <p class="first">Some text</p>
        <div>
          <button class="first" ng-click="$ctrl.callback()">Click me</button>
          <button class="second">Or me</button>
          <a href="https://transferwise.com" target="_blank">Or even me</a>
        </div>
      `);

      expect(html).toBe(expectedHtml);
    });
  });

  describe('text', () => {
    it('returns wrapper text', () => {
      const text = trimWhitespace(wrapper.text());
      expect(text).toBe('Some text Click me Or me Or even me');
    });
  });

  describe('hasClass', () => {
    it('returns true if wrapper has class', () => {
      const p = wrapper.find('p');
      expect(p.hasClass('first')).toBe(true);
    });

    it('returns false if wrapper does not have class', () => {
      const p = wrapper.find('p');
      expect(p.hasClass('second')).toBe(false);
    });
  });

  describe('exists', () => {
    it('returns true when wrapper contains one or more elements', () => {
      expect(wrapper.find('a').exists()).toBe(true);
    });

    it('returns false when wrapper does not contain any elements', () => {
      expect(wrapper.find('form').exists()).toBe(false);
    });
  });

  describe('find', () => {
    it('allows finding by any query', () => {
      const secondButton = wrapper.find('.first');
      expect(secondButton.length).toBe(2);
    });

    it('returns a test element wrapper for chainable operations', () => {
      const link = wrapper.find('[href]');
      expect(link).toBeInstanceOf(TestElementWrapper);
    });
  });

  describe('props', () => {
    it('returns props', () => {
      const link = wrapper.find('a');
      expect(link.props()).toEqual({ href: 'https://transferwise.com', target: '_blank' });
    });
  });

  describe('prop', () => {
    it('returns prop with key', () => {
      const link = wrapper.find('a');
      expect(link.prop('href')).toBe('https://transferwise.com');
    });
  });

  describe('simulate', () => {
    it('simulates event', () => {
      const buttonWithCallback = wrapper.find('button[ng-click]');

      expect(callback).not.toBeCalled();
      buttonWithCallback.simulate('click');
      expect(callback).toBeCalled();
    });
  });

  describe('setProps', () => {
    it('sets props and updates view to reflect them', () => {
      const template = `
        <some-component
          title="$ctrl.title"
          text="$ctrl.text"
        ></some-component>
      `;
      wrapper = new TestElementWrapper(getAngularElement(template));

      const title = () => trimWhitespace(wrapper.find('h1').text());
      const text = () => trimWhitespace(wrapper.find('p').text());

      expect(title()).toBe('');
      expect(text()).toBe('');
      wrapper.setProps({ title: 'A title', text: 'A text' });
      expect(title()).toBe('A title');
      expect(text()).toBe('A text');
    });
  });

  function getAngularElement(template) {
    let $scope;
    let angularElement;

    angular.mock.inject(($compile, $injector) => {
      $scope = $injector.get('$rootScope').$new();
      $scope.$ctrl = { callback };
      angularElement = $compile(template)($scope);
    });
    $scope.$digest();

    return angularElement;
  }
});

function trimWhitespace(text) {
  return text.trim().replace(/\s+/g, ' ');
}
