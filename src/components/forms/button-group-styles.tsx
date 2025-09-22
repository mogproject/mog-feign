import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';

export const buttonInputStyles = css({
  clip: 'rect(0, 0, 0, 0)',
  pointerEvents: 'none',
  position: 'absolute',
});

// Base styles.
const buttonStyles = css({
  userSelect: 'none',
  cursor: 'pointer',
  color: token('color.background.success.bold'),
  borderColor: token('color.background.success.bold'),
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: '3px',
  padding: '5px 20px',
  zIndex: '1', // proir to labels
  textWrap: 'nowrap',
});

export const labelStyles = css({
  padding: '5px 8px',
  backgroundColor: token('color.background.input.hovered'),
  borderWidth: '1px',
  borderColor: token('color.border.accent.gray'),
  borderStyle: 'solid',
  borderRadius: '3px',
  textWrap: 'nowrap',
});

export const buttonCheckedStyles = css({
  color: token('color.icon.inverse'),
  backgroundColor: token('color.background.success.bold'),
  ':hover': {
    backgroundColor: token('color.background.success.bold.hovered'),
  },
});

export const radioButtonStyles = css([
  buttonStyles,
  {
    backgroundColor: token('color.icon.inverse'),
    ':hover': {
      color: token('color.icon.inverse'),
      backgroundColor: token('color.background.success.bold.hovered'),
    },
  },
]);

export const checkButtonStyles = css([
  buttonStyles,
  {
    backgroundColor: token('color.icon.inverse'),
    ':hover': {
      backgroundColor: token('color.background.neutral.subtle.hovered'),
    },
  },
]);

export const buttonGroupNotFirstStyles = css({
  marginLeft: '-1px',
  borderTopLeftRadius: '0',
  borderBottomLeftRadius: '0',
});

export const buttonGroupNotLastStyles = css({
  borderTopRightRadius: '0',
  borderBottomRightRadius: '0',
});

export const buttonGroupStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
});
