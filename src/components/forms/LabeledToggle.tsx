import React, { Fragment } from 'react';
import { css } from '@emotion/react';
import {
  buttonInputStyles,
  checkButtonStyles,
  buttonCheckedStyles,
  buttonGroupNotFirstStyles,
  buttonGroupNotLastStyles,
} from './button-group-styles';

export const toggleLabelStyles = css({
  marginTop: '2px',
  label: {
    userSelect: 'none',
    cursor: 'pointer',
  },
});

type LabeledToggleProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  isNotFirstOfGroup?: boolean;
  isNotLastOfGroup?: boolean;
};

const LabeledToggle: React.FC<LabeledToggleProps> = ({ id, label, checked, onChange, isNotFirstOfGroup, isNotLastOfGroup}) => {
  return (
    <Fragment key={id}>
      <input
        css={[buttonInputStyles]}
        id={id}
        autoComplete="off"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label
        css={[
          checkButtonStyles,
          checked && buttonCheckedStyles,
          isNotFirstOfGroup && buttonGroupNotFirstStyles,
          isNotLastOfGroup && buttonGroupNotLastStyles,
        ]}
        htmlFor={id}
      >
        {label}
      </label>
    </Fragment>
  );
};

export default LabeledToggle;
