import 'angular';
import 'angular-mocks';

import { mount } from './src/main';

angular.module('shoppingList', []).component('shoppingList', {
  template: `
    <input type="text" ng-model="$ctrl.newItem" />
    <button ng-click="$ctrl.onAddItem({ $event: $ctrl.newItem })">
      Add item
    </button>

    <ul ng-repeat="item in $ctrl.items">
      <li>{{ item }}</li>
    </ul>
  `,
  bindings: {
    items: '<',
    onAddItem: '&',
  },
});

describe('Shopping list', () => {
  let component;
  beforeEach(() => {
    angular.mock.module('shoppingList');

    component = mount(
      `
        <shopping-list
          items="$ctrl.items"
          on-add-item="$ctrl.onAddItem($event)"
        ></shopping-list>
      `,
    );
  });

  it('has no list when no items are passed', () => {
    component.setProps({ items: [] });

    expect(component.find('ul').exists()).toBe(false);
  });

  it('has list when items are passed', () => {
    component.setProps({ items: ['Nutella'] });

    expect(component.find('ul').exists()).toBe(true);
  });

  it('has list items when items are passed', () => {
    component.setProps({ items: ['Nutella', 'Banana', 'Strawberries'] });

    expect(component.find('li').map(li => li.text())).toEqual([
      'Nutella',
      'Banana',
      'Strawberries',
    ]);
  });

  it('allows adding items', () => {
    const onAddItem = jest.fn();
    component.setProps({ onAddItem });

    expect(onAddItem).not.toBeCalled();
    changeInput('Pretzels');
    clickAddButton();
    expect(onAddItem).toBeCalledWith('Pretzels');
  });

  function changeInput(value) {
    component.find('input').simulate('change', { target: { value } });
  }

  function clickAddButton() {
    component.find('button').simulate('click');
  }
});
