import { getPropsDefinition } from '../component';
import AngularjsEnzymeError from './AngularjsEnzymeError';

export function validate(tag) {
  assertAllPropsAreOneWayBound(tag);
}

function assertAllPropsAreOneWayBound(tag) {
  const notOneWayBoundPropsExist = getNotOneWayBoundPropNames(tag).length > 0;

  if (notOneWayBoundPropsExist) {
    throw new AngularjsEnzymeError("All props of component under test must be one-way bound ('<')");
  }
}

function getNotOneWayBoundPropNames(tag) {
  const propsDefinition = getPropsDefinition(tag);
  const notOneWayBoundPropNames = Object.entries(propsDefinition)
    .filter(([, type]) => type !== '<')
    .map(([name]) => name);

  return notOneWayBoundPropNames;
}
