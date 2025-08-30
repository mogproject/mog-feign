import React from 'react';
import { useTranslation } from 'react-i18next';
// Note: Importing from '@atlaskit/select' breaks creatable select.
import CreatableSelect from '@atlaskit/select/CreatableSelect';
import { type OptionType } from '@atlaskit/select/dist/types/types';

const createOption = (label: string) =>
  ({
    label: label,
    value: label.toLowerCase().replace(/\W/g, ''),
  } as OptionType);

interface CreatableMultiSelectProps {
  initialOptions: string[];
  placeholder?: string;
}

const CreatableMultiSelect: React.FC<CreatableMultiSelectProps> = ({ initialOptions, placeholder = '' }) => {
  const { t: translate } = useTranslation('translation');
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const [selectedOptions, setSelectedOptions] = React.useState<OptionType[]>([]);

  return (
    <CreatableSelect
      isMulti
      isClearable
      placeholder={placeholder}
      formatCreateLabel={(s: string) => t('create_label', { name: s })}
      noOptionsMessage={(obj: { inputValue: string }) => t('no_options', { name: obj.inputValue })}
      options={initialOptions.map(createOption)}
      value={selectedOptions}
      onCreateOption={(v: string) => setSelectedOptions([...selectedOptions, createOption(v)])}
      onChange={setSelectedOptions}
    />
  );
};

export default CreatableMultiSelect;
