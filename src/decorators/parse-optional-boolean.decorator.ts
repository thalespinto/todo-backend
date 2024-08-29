import { Transform } from 'class-transformer';

const optionalBooleanMapper = new Map([
  ['true', true],
  ['false', false],
]);

export const ParseOptionalBoolean = () =>
  Transform(({ value }) => optionalBooleanMapper.get(value));