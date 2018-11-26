import Symbol from 'core-js/library/fn/symbol';

const angularElementSymbol = Symbol('_angularElement');

export default class TestElementWrapper {
  constructor(angularElement) {
    Object.defineProperty(this, angularElementSymbol, { value: angularElement });

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
    const foundElement = this[angularElementSymbol][0].querySelectorAll(selector);
    return elementToTestElementWrapper(foundElement);
  }

  first() {
    const firstElement = this[angularElementSymbol][0];
    return elementToTestElementWrapper(firstElement);
  }

  at(index) {
    const elementAtIndex = this[angularElementSymbol][index];
    return elementToTestElementWrapper(elementAtIndex);
  }

  map(fn) {
    return Array.from(this[angularElementSymbol])
      .map(elementToTestElementWrapper)
      .map(fn);
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
