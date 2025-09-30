import { OptionType } from '@atlaskit/select';

export const createOption = (label: string) =>
  ({
    label: label,
    value: label.toLowerCase(),
  } as OptionType);
