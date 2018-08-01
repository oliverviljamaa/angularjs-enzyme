export default class TestElementWrapper {
  constructor(angularElement) {
    this.length = angularElement.length;

    this.html = () => angularElement.html();
    this.text = () => angularElement.text();
    this.hasClass = name => angularElement.hasClass(name);

    this.exists = () => angularElement && angularElement.length > 0;

    this.find = query => {
      const foundAngularElement = angular.element(angularElement[0].querySelectorAll(query));
      return new TestElementWrapper(foundAngularElement);
    };

    this.props = () =>
      [...angularElement[0].attributes].reduce(
        (props, { name, value }) => ({ ...props, [name]: value }),
        {},
      );

    this.prop = key => angularElement.attr(key);

    this.simulate = event => {
      angularElement.triggerHandler(event);
    };

    this.setProps = props => {
      const controller = angularElement.isolateScope().$ctrl;
      Object.entries(props).forEach(([key, value]) => {
        controller[key] = value;
      });
      angular.mock.inject($injector => {
        $injector.get('$rootScope').$digest();
      });
    };
  }
}
