import { Inline } from '@atlaskit/primitives';
import React, { Fragment } from 'react';
import {
  buttonCheckedStyles,
  buttonGroupNotFirstStyles,
  buttonGroupNotLastStyles,
  buttonInputStyles,
  radioButtonStyles,
} from './button-group-styles';

type RadioButtonGroupProps = {
  id: string;
  labels: string[];
  checked: number;
  onChange: (index: number) => void;
};

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ id, labels, checked, onChange }) => {
  return (
    <Inline id={id}>
      {labels.map((v, i) => (
        <Fragment key={`${id}-${i}`}>
          <input
            css={[buttonInputStyles]}
            id={`${id}-${i}`}
            autoComplete="off"
            type="radio"
            radioGroup={id}
            checked={checked === i}
            onChange={(event) => event.target.checked && onChange(i)}
          />
          <label
            css={[
              radioButtonStyles,
              checked === i && buttonCheckedStyles,
              i !== 0 && buttonGroupNotFirstStyles,
              i !== labels.length - 1 && buttonGroupNotLastStyles,
            ]}
            htmlFor={`${id}-${i}`}
          >
            {v}
          </label>
        </Fragment>
      ))}
    </Inline>
  );
};

export default RadioButtonGroup;
