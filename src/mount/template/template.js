import { getPropsDefinition } from '../component';
import { convertCamelCaseToKebabCase } from '../../common/utils';

export function createTemplate(tag) {
  const propsDefinition = getPropsDefinition(tag);
  const propNames = Object.keys(propsDefinition);
  const propsString = getPropsAsString(propNames);

  return `<${tag}${propsString ? ` ${propsString}` : ''}></${tag}>`;
}

function getPropsAsString(names) {
  return names.map(nameToAttributeAndValueString).join(' ');
}

function nameToAttributeAndValueString(name) {
  return `${convertCamelCaseToKebabCase(name)}="$ctrl.${name}"`;
}
