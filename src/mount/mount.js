import { validate } from './validation';
import { createTemplate } from './template';
import { compile } from './component';
import TestElementWrapper from './TestElementWrapper';

export default function mount(tag, props = {}) {
  validate(tag);

  const template = createTemplate(tag);
  const angularElement = compile(template, props);

  return new TestElementWrapper(angularElement);
}
