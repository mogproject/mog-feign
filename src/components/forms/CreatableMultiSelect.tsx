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
}

const CreatableMultiSelect: React.FC<CreatableMultiSelectProps> = ({ initialOptions }) => {
  const { t: translate } = useTranslation('translation');
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const [options, setOptions] = React.useState<OptionType[]>(initialOptions.map(createOption));
  const [selectedOptions, setSelectedOptions] = React.useState<OptionType[]>([]);

  return (
    <CreatableSelect
      isMulti
      isClearable
      placeholder={t('group')}
      onCreateOption={(inputValue: string) => {
        const newOption = createOption(inputValue);
        setOptions([...options, newOption]);
        setSelectedOptions([...selectedOptions, newOption]);
      }}
      onChange={setSelectedOptions}
      formatCreateLabel={(s: string) => t('create_label', { name: s })}
      options={options}
      value={selectedOptions}
    />
  );
};

export default CreatableMultiSelect;
