import React from 'react';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';

import InlineEdit from '@atlaskit/inline-edit';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import { OptionType, ValueType } from '@atlaskit/select';
import Lozenge from '@atlaskit/lozenge';

// Note: Importing from '@atlaskit/select' breaks creatable select.
import CreatableSelect from '@atlaskit/select/CreatableSelect';
import { createOption } from './select-helper';

const compactSelectStyles = {
  control: (base: any) => ({
    ...base,
    minHeight: '28px',
  }),
  valueContainer: (base: any) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  indicatorsContainer: (base: any) => ({
    ...base,
    height: '30px',
  }),
};

const readViewContainerStyles = xcss({
  font: token('font.body'),
  color: 'color.text.subtlest',
  paddingBlock: 'space.075',
  paddingInline: 'space.0',
  overflow: 'hidden',
});

interface EditableMultiSelectProps {
  defaultValue: string[];
  options: string[];
  onConfirm: (value: ValueType<OptionType, true>) => void;
  keyPrefix: string;
}

const EditableMultiSelect: React.FC<EditableMultiSelectProps> = ({ defaultValue, options, onConfirm, keyPrefix }) => {
  const { t: translate } = useTranslation('translation');
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const [editVersion, setEditVersion] = React.useState(0);
  const emptyGroup = '----';

  const onConfirmWrapper = (value: ValueType<OptionType, true>) => {
    const trimmed = Array.from(new Set(value.map((opt) => opt.label.trim()).filter((s) => s !== '')));
    setEditVersion(editVersion + 1);
    onConfirm(trimmed.map(createOption));
  };

  return (
    <div css={css({ marginTop: '-8px' })}>
      <InlineEdit<ValueType<OptionType, true>>
        hideActionButtons={false}
        defaultValue={defaultValue.map(createOption)}
        key={`${keyPrefix}-${editVersion}`}
        editView={({ ...fieldProps }) => (
          <CreatableSelect
            {...fieldProps}
            styles={compactSelectStyles}
            isMulti
            isClearable
            placeholder=""
            formatCreateLabel={(s: string) => t('create_label', { name: s })}
            noOptionsMessage={(obj: { inputValue: string }) => t('no_options', { name: obj.inputValue })}
            options={options.map(createOption)}
            autoFocus
            openMenuOnFocus
          />
        )}
        readView={() =>
          defaultValue && defaultValue.length === 0 ? (
            <Box xcss={readViewContainerStyles}>{emptyGroup}</Box>
          ) : (
            <Inline xcss={readViewContainerStyles} space="space.100">
              {defaultValue.map((opt: string) => (
                <Lozenge key={opt}>{opt}</Lozenge>
              ))}
            </Inline>
          )
        }
        onConfirm={onConfirmWrapper}
      />
    </div>
  );
};

export default EditableMultiSelect;
