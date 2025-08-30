import React from 'react';
import { useTranslation } from 'react-i18next';
// Note: Importing from '@atlaskit/select' breaks creatable select.
import CreatableSelect from '@atlaskit/select/CreatableSelect';
import { type OptionType, ValueType } from '@atlaskit/select/dist/types/types';

const createOption = (label: string) =>
  ({
    label: label,
    value: label.toLowerCase().replace(/\W/g, ''),
  } as OptionType);

interface CreatableMultiSelectProps {
  defaultValue?: ValueType<OptionType, true>;
  options?: string[];
  placeholder?: string;
  autoFocus?: boolean;
  openMenuOnFocus?: boolean;
}

const CreatableMultiSelect: React.FC<CreatableMultiSelectProps> = ({
  defaultValue = [],
  options = [],
  placeholder = '',
  autoFocus = false,
  openMenuOnFocus = false,
  ...props
}) => {
  const { t: translate } = useTranslation('translation');
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const [selectedOptions, setSelectedOptions] = React.useState<ValueType<OptionType, true>>(defaultValue);

  return (
    <CreatableSelect
      {...props}
      isMulti
      isClearable
      placeholder={placeholder}
      formatCreateLabel={(s: string) => t('create_label', { name: s })}
      noOptionsMessage={(obj: { inputValue: string }) => t('no_options', { name: obj.inputValue })}
      options={options.map(createOption)}
      value={selectedOptions}
      onCreateOption={(v: string) => setSelectedOptions([...selectedOptions, createOption(v)])}
      onChange={setSelectedOptions}
      autoFocus={autoFocus}
      openMenuOnFocus={openMenuOnFocus}
    />
  );
};

export default CreatableMultiSelect;
