import React, { Fragment } from 'react';
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

type RadioButtonGroupProps = {
  id: string;
  labels: string[];
  checked: number;
  onChange: (index: number) => void;
};

const btnGroupStyles = css({
  display: 'inline-flex',
  alignItems: 'center',

  '.btn': {
    userSelect: 'none',
    cursor: 'pointer',
    borderWidth: '1px',
    borderColor: token('color.background.success.bold'),
    borderStyle: 'solid',
    borderRadius: '3px',
    padding: '4px 6px',
    color: token('color.background.success.bold'),
    backgroundColor: token('color.icon.inverse'),
    ':hover': {
      color: token('color.icon.inverse'),
      backgroundColor: token('color.background.success.bold.hovered'),
    },
    ':not(:last-of-type)': {
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0',
    },
    ':not(:first-of-type) ': {
      marginLeft: '-1px',
      borderTopLeftRadius: '0',
      borderBottomLeftRadius: '0',
    },
  },
  '.btn-check:checked + .btn': {
    color: token('color.icon.inverse'),
    backgroundColor: token('color.background.success.bold'),
    ':hover': {
      backgroundColor: token('color.background.success.bold.hovered'),
    },
  },
});

const btnCheckStyles = css({
  clip: 'rect(0, 0, 0, 0)',
  pointerEvents: 'none',
  position: 'absolute',
});

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ id, labels, checked, onChange }) => {
  return (
    <div id={id} css={btnGroupStyles}>
      {labels.map((v, i) => (
        <Fragment key={`${id}-${i}`}>
          <input
            className="btn-check"
            css={[btnCheckStyles]}
            id={`${id}-${i}`}
            autoComplete="off"
            type="radio"
            radioGroup={id}
            checked={checked === i}
            onChange={(event) => event.target.checked && onChange(i)}
          />
          <label className="btn" htmlFor={`${id}-${i}`}>
            {v}
          </label>
        </Fragment>
      ))}
    </div>
  );
};

export default RadioButtonGroup;
