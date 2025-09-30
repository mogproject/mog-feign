import { OptionType } from '@atlaskit/select';

export const createOption = (label: string) =>
  ({
    label: label,
    value: label.toLowerCase().replace(/\W/g, ''),
  } as OptionType);
