# :rotating_light: AngularJS Enzyme

[![npm](https://img.shields.io/npm/v/angularjs-enzyme.svg)](https://www.npmjs.com/package/angularjs-enzyme) [![GitHub release](https://img.shields.io/github/release/oliverviljamaa/angularjs-enzyme.svg)](https://github.com/oliverviljamaa/angularjs-enzyme/releases) [![CircleCI](https://img.shields.io/circleci/project/github/oliverviljamaa/angularjs-enzyme/master.svg)](https://circleci.com/gh/oliverviljamaa/angularjs-enzyme) [![npm](https://img.shields.io/npm/l/angularjs-enzyme.svg)](https://github.com/oliverviljamaa/angularjs-enzyme/blob/master/LICENSE)

Unit testing utility for [AngularJS (1.x)](https://angularjs.org/), heavily inspired by the wonderful [Enzyme](http://airbnb.io/enzyme/) API. :heart:  
Therefore, it is well suited for organisations and individuals **moving from AngularJS to React**. It is **test framework and runner agnostic**, but the examples are written using [Jest](https://github.com/facebook/jest) syntax.

[**An example showing the utility in use can be found here.**](example.test.js)

Available methods:  
[`mount`](#mounttemplate-props--testelementwrapper)  
[`mockComponent`](#mockcomponentname--mock)

Returned classes:  
[`TestElementWrapper`](#testelementwrapper-api)  
[`mock`](#mock-api)

## Usage

```bash
npm install angularjs-enzyme --save-dev
```

### Module context

```js
import { mount, mockComponent } from 'angularjs-enzyme';
```

### Non-module context

1. Include the script from `node_modules/angularjs-enzyme/dist/angularjs-enzyme.js`.
2. Use the utility from the global context under the name `angularjsEnzyme`.

## API

### `mount(template[, props]) => TestElementWrapper`

Mounts the `template` (`String`) with optional `props` (`Object`) and returns a [`TestElementWrapper`](#testelementwrapper-api) with numerous helper methods. The props are attached to the `$ctrl` available in the template scope.

<details>
  <summary>Example</summary>

```js
import 'angular';
import 'angular-mocks';
import { mount } from 'angularjs-enzyme';

describe('Component under test', () => {
  const TEMPLATE = `
    <h1>{{ $ctrl.title }}</h1>
    <p>{{ $ctrl.text }}</p>
  `;

  let component;
  beforeEach(() => {
    angular.mock.module('moduleOfComponentUnderTest');
    component = mount(TEMPLATE, { title: 'A title', text: 'Some text' });
  });
});
```

</details>

### `mockComponent(name) => mock`

By default, AngularJS renders the whole component tree. This function mocks a child component with `name` (`String`) in the component under test and returns a [`mock`](#mock-api). The child component won't be compiled and its controller won't be invoked, enabling testing the component under test in isolation. In addition, the returned `mock` has methods useful for testing.

<details>
  <summary>Example</summary>

```js
import 'angular';
import 'angular-mocks';
import { mockComponent } from 'angularjs-enzyme';

describe('Component under test', () => {
  let childComponent;
  beforeEach(() => {
    angular.mock.module('moduleOfComponentUnderTest');
    childComponent = mockComponent('child-component'); // ⇦ after module, before inject
  });
});
```

</details>

### `TestElementWrapper` API

#### `.length => Number`

The number of elements in the wrapper.

<details>
  <summary>Example</summary>

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

```js
it('has three list items', () => {
  expect(component.find('li').length).toBe(3);
});
```

</details>

#### `.html() => String`

Returns HTML of the wrapper. It should only be used for logging purposes, in tests other methods should be preferred.

<details>
  <summary>Example</summary>

```html
<h1>Some title</h1>
```

```js
it('renders title as html', () => {
  expect(component.html()).toBe('<h1>Some title</h1>');
});
```

</details>

#### `.text() => String`

<details>
  <summary>Example</summary>

```html
<h1>Some title</h1>
<p>Some text</p>
```

```js
it('has paragraph text', () => {
  expect(component.find('p').text()).toBe('Some text');
});
```

</details>

#### `.hasClass(className) => Boolean`

Returns whether the wrapper has a class with `className` (`String`) or not.

<details>
  <summary>Example</summary>

```html
<button class="success">Pay</button>
```

```js
it('has success class', () => {
  expect(component.find('button').hasClass('success')).toBe(true);
});

it('does not have error class', () => {
  expect(component.find('button').hasClass('error')).toBe(false);
});
```

</details>

#### `.exists() => Boolean`

Returns whether or not the wrapper contains any elements.

<details>
  <summary>Example</summary>

```html
<button>Pay</button>
```

```js
it('has button', () => {
  expect(component.find('button').exists()).toBe(true);
});

it('does not have link', () => {
  expect(component.find('a').exists()).toBe(false);
});
```

</details>

#### `.find(selector) => TestElementWrapper`

Returns a [`TestElementWrapper`](#testelementwrapper-api) (for chaining) with every element matching the `selector` (`String`).

<details>
  <summary>Example</summary>

```html
<div class="left">
  <a href="https://neopets.com">Wrong</a>
  <a href="https://transferwise.com">Wrong</a>
</div>
<div class="right">
  <a href="https://neopets.com">Wrong</a>
  <a href="https://transferwise.com">Correct</a>
</div>
```

```js
it('has one transferwise link with corrext text on the right', () => {
  const link = component.find('.right a[href="https://transferwise.com"]');

  expect(link.length).toBe(1);
  expect(link.text()).toBe('Correct');
});
```

</details>

#### `.first() => TestElementWrapper`

Returns a [`TestElementWrapper`](#testelementwrapper-api) (for chaining) for the first element.

<details>
  <summary>Example</summary>

```html
<button class="btn btn-primary">Balance</button>
<button class="btn btn-primary">Bank transfer</button>
<button class="btn btn-primary">Card</button>
```

```js
it('has balance as the first button', () => {
  const firstButton = component.find('button').first();
  expect(firstButton.text()).toBe('Balance');
});
```

</details>

#### `.at(index) => TestElementWrapper`

Returns a [`TestElementWrapper`](#testelementwrapper-api) (for chaining) for element at `index` (`Number`).

<details>
  <summary>Example</summary>

```html
<button class="btn btn-primary">Balance</button>
<button class="btn btn-primary">Bank transfer</button>
<button class="btn btn-primary">Card</button>
```

```js
it('has card as third button', () => {
  const thirdButton = component.find('button').at(2);
  expect(thirdButton.text()).toBe('Card');
});
```

</details>

#### `.map(fn) => Array<Any>`

Maps the nodes in the wrapper to another array using `fn` (`Function`).

<details>
  <summary>Example</summary>

```html
<ul>
  <li>One</li>
  <li>Two</li>
  <li>Three</li>
</ul>
```

```js
it('has three list items with their number as a word', () => {
  const items = component.find('li');

  expect(items.map(item => item.text())).toEqual(['One', 'Two', 'Three']);
});
```

</details>

#### `.props() => Object`

Returns all wrapper props/attributes.

<details>
  <summary>Example</summary>

```html
<a href="https://transferwise.com" target="_blank">Send money</a>
```

```js
it('has transferwise link that opens in a new tab', () => {
  expect(component.find('a').props()).toEqual({
    href: 'https://transferwise.com',
    target: '_blank',
  });
});
```

</details>

#### `.prop(key) => String`

Returns wrapper prop/attribute value with provided `key` (`String`).

<details>
  <summary>Example</summary>

```html
<a href="https://transferwise.com">Send money</a>
```

```js
it('has transferwise link', () => {
  expect(component.find('a').prop('href')).toBe('https://transferwise.com');
});
```

</details>

#### `.simulate(event[, data]) => Self`

Calls an event handler on the wrapper for passed `event` with `data` (optional) and returns wrapper for chaining.

NOTE: `event` should be written in camelCase and without the `on` present in the event handler name. Currently, `change` and `click` events are supported, with `change` requiring an event format.

<details>
  <summary>Example</summary>

```html
<input ng-model="$ctrl.text" />
<p>{{ $ctrl.text }}</p>
<button ng-click="$ctrl.onClick({ $event: $ctrl.text })">Click me</button>
```

```js
let component;
let onClick;
beforeEach(() => {
  onClick = jest.fn();
  component = mount(
    `
      <some-component
        text="$ctrl.text"
        on-click="$ctrl.onClick($event)"
      ></some-component>
    `,
    { text: 'Original text', onClick },
  );
});

it('calls click handler on button click', () => {
  const button = component.find('button');

  expect(onClick).not.toBeCalled();
  button.simulate('click');
  expect(onClick).toBeCalledWith('Original text');
});

it('changes text on input change', () => {
  const input = component.find('input');

  const text = () => component.find('p').text();

  expect(text()).toBe('Original text');
  input.simulate('change', { target: { value: 'New text' } });
  expect(text()).toBe('New text');
});
```

</details>

#### `.setProps(props) => Self`

Merges `props` (`Object`) with existing props and updates view to reflect them, returning itself for chaining.

<details>
  <summary>Example</summary>

```html
<h1>{{ $ctrl.title }}</h1>
<p>{{ $ctrl.text }}</p>
```

```js
it('changes title and text when props change', () => {
  const component = mount(
    `
      <some-component
        title="$ctrl.title"
        text="$ctrl.text"
      ></some-component>
    `,
    { title: 'Original title', text: 'Original text' },
  );

  const title = () => component.find('h1').text();
  const text = () => component.find('p').text();

  expect(title()).toBe('Original title');
  expect(text()).toBe('Original text');
  component.setProps({ title: 'New title', text: 'New text' });
  expect(title()).toBe('New title');
  expect(text()).toBe('New text');
});
```

</details>

### `mock` API

#### `.exists() => Boolean`

Returns whether or not the mocked component exists in the rendered template.

<details>
  <summary>Example</summary>

```js
let component;
beforeEach(() => {
  component = mount(`
    <button ng-click="$ctrl.show = !$ctrl.show">
      Show child
    </button>
    <child-component ng-if="$ctrl.show"></child-component>
  `);
});

it('allows toggling child component', () => {
  const button = component.find('button');

  expect(childComponent.exists()).toBe(false);
  button.simulate('click');
  expect(childComponent.exists()).toBe(true);
  button.simulate('click');
  expect(childComponent.exists()).toBe(false);
});
```

</details>

#### `.props() => Object`

Returns all mocked component props.

<details>
  <summary>Example</summary>

```js
let component;
beforeEach(() => {
  component = mount(`
    <div>Something else</div>
    <child-component
      some-prop="'A string'",
      some-other-prop="12345"
    ></child-component>
  `);
});

it('passes props to child component', () => {
  expect(childComponent.props()).toEqual({
    someProp: 'A string',
    someOtherProp: 12345,
  });
});
```

</details>

#### `.prop(key) => Any`

Returns mocked component prop value with the provided `key` (`String`).

<details>
  <summary>Example</summary>

```js
let component;
beforeEach(() => {
  component = mount(`
    <div>Something else</div>
    <child-component some-prop="'A string'"></child-component>
  `);
});

it('passes some prop to child component', () => {
  expect(childComponent.prop('someProp')).toBe('A string');
});
```

</details>

#### `.simulate(event[, data]) => Self`

Calls an event handler on the mocked component for passed `event` with `data` (optional) and returns mocked component for chaining.

NOTE: `event` should be written in camelCase and without the `on` present in the event handler name. So, to call `onSomePropChange`, `.simulate('somePropChange')` should be used.

<details>
  <summary>Example</summary>

```js
it('calls parent component with data when child component is called', () => {
  const onSomePropChange = jest.fn();
  mount(
    `
      <div>Something else</div>
      <child-component
        on-some-prop-change="onSomePropChange($event)"
      ></child-component>
    `,
    { onSomePropChange }, // ⇦ props for component under test
  );

  expect(onSomePropChange).not.toBeCalled();
  childComponent.simulate('somePropChange', 'New value');
  expect(onSomePropChange).toBeCalledWith('New value');
});
```

</details>

## Contributing

1. Run tests with `npm run test:watch`. `npm test` will check for package and changelog version match, ESLint and Prettier format in addition.
1. Bump version number in `package.json` according to [semver](http://semver.org/) and add an item that a release will be based on to `CHANGELOG.md`.
1. Submit your pull request from a feature branch and get code reviews.
1. If the pull request is approved and the [CircleCI build](https://circleci.com/gh/oliverviljamaa/angularjs-enzyme) passes, you will be able to squash/rebase and merge.
1. Code will automatically be released to [GitHub](https://github.com/oliverviljamaa/angularjs-enzyme/releases) and published to [npm](https://www.npmjs.com/package/angularjs-enzyme) according to the version specified in the changelog and `package.json`.

## Other

For features and bugs, feel free to [add issues](https://github.com/oliverviljamaa/angularjs-enzyme/issues) or contribute.
