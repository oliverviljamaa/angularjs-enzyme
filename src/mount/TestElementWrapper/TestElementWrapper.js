import Symbol from 'es6-symbol';

const angularElementSymbol = Symbol('_angularElement');
const mockedComponentsSymbol = Symbol('_mockedComponents');

export default class TestElementWrapper {
  constructor(angularElement, mockedComponents = {}) {
    Object.defineProperties(this, {
      [angularElementSymbol]: { value: angularElement },
      [mockedComponentsSymbol]: { value: mockedComponents },
    });

    this.length = angularElement.length;
  }

  html() {
    return this[angularElementSymbol].html();
  }

  text() {
    return this[angularElementSymbol].text();
  }

  hasClass(name) {
    return this[angularElementSymbol].hasClass(name);
  }

  exists() {
    return this[angularElementSymbol] && this[angularElementSymbol].length > 0;
  }

  find(selector) {
    const mockedComponents = this[mockedComponentsSymbol];
    const mockedComponentNames = Object.keys(mockedComponents);

    if (mockedComponentNames.indexOf(selector) > -1) {
      return mockedComponents[selector];
    }

    const foundElement = this[angularElementSymbol][0].querySelectorAll(selector);
    return elementToTestElementWrapper(foundElement);
  }

  map(fn) {
    return [...this[angularElementSymbol]].map(elementToTestElementWrapper).map(fn);
  }

  props() {
    return [...this[angularElementSymbol][0].attributes].reduce(
      (props, { name, value }) => ({ ...props, [name]: value }),
      {},
    );
  }

  prop(key) {
    return this[angularElementSymbol].attr(key);
  }

  simulate(event, data) {
    if (event === 'change') {
      if (!data || !data.target) {
        throw new Error('Simulating change expects an event object ({ target: { value } })');
      }
      this[angularElementSymbol].val(data.target.value).triggerHandler('input');
      return this;
    }
    this[angularElementSymbol].triggerHandler(event);

    return this;
  }

  setProps(props) {
    let $rootScope;
    angular.mock.inject($injector => {
      $rootScope = $injector.get('$rootScope');
    });

    $rootScope.$ctrl = {
      ...$rootScope.$ctrl,
      ...props,
    };

    $rootScope.$digest();

    return this;
  }
}

function elementToTestElementWrapper(element) {
  return new TestElementWrapper(angular.element(element));
}
