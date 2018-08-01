import 'angular';
import 'angular-mocks';

import mount from '.';
import TestElementWrapper from './TestElementWrapper';

jest.mock('./TestElementWrapper');

describe('Mount', () => {
  beforeEach(() => {
    angular
      .module('some-module', [])
      .component('someComponent', {
        bindings: { someProp: '<' },
        template: `
          <main>
            <p class="first">{{ $ctrl.someProp }}</p>
            <div>
              <button class="first">Click me</button>
              <button class="second">Or me</button>
            </div>
          </main>
        `,
      })
      .config(configRemovingAngularClasses());

    angular.mock.module('some-module');

    TestElementWrapper.mockImplementation(angularElement => angularElement);
  });

  it('returns a test element wrapper created from angular element', () => {
    expect(TestElementWrapper).not.toBeCalled();
    const angularElement = mount('<some-component></some-component>');
    expect(TestElementWrapper).toBeCalledWith(angularElement);
  });

  it('makes props accessible through $ctrl', () => {
    const angularElement = mount('<some-component some-prop="$ctrl.text"></some-component>', {
      text: 'Some text',
    });

    const html = trimWhitespace(angularElement.html());
    const expectedHtml = trimWhitespace(
      `
        <main>
          <p class="first">Some text</p>
          <div>
            <button class="first">Click me</button>
            <button class="second">Or me</button>
          </div>
        </main>
      `,
    );

    expect(html).toBe(expectedHtml);
  });
});

function trimWhitespace(text) {
  return text.trim().replace(/\s+/g, ' ');
}

function configRemovingAngularClasses() {
  return [
    '$compileProvider',
    $compileProvider => {
      $compileProvider.debugInfoEnabled(false);
    },
  ];
}
