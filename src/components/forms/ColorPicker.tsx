import React from 'react';
import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

import { buttonGroupNotFirstStyles, buttonGroupNotLastStyles } from './button-group-styles';

const colorPickerStyles = css({
  width: '50px',
  height: '32px',
  cursor: 'pointer',
  borderColor: token('color.border.accent.gray'),
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '3px',
  zIndex: '1',
});

type ColorPickerProps = {
  id?: string;
  title: string;
  value: string;
  onChange: (color: string) => void;
  isNotFirstOfGroup?: boolean;
  isNotLastOfGroup?: boolean;
};

const ColorPicker: React.FC<ColorPickerProps> = ({ id, title, value, onChange, isNotFirstOfGroup, isNotLastOfGroup }) => {
  const debounce = 200; // in milliseconds
  const [rawColor, setRawColor] = React.useState(value);

  React.useEffect(() => {
    const timeout = setTimeout(() => onChange(rawColor), debounce);
    return () => clearTimeout(timeout);
  }, [rawColor]);

  return (
    <input
      id={id}
      type="color"
      title={title}
      value={value}
      css={[colorPickerStyles, isNotFirstOfGroup && buttonGroupNotFirstStyles, isNotLastOfGroup && buttonGroupNotLastStyles]}
      onChange={(e) => setRawColor(e.target.value)}
    />
  );
};
export default ColorPicker;
