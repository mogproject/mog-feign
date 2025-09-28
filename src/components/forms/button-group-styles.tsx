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
  textWrap: 'nowrap',
  zIndex: '1',
});

export const labelStyles = css({
  padding: '5px 8px',
  backgroundColor: token('color.background.input.hovered'),
  borderWidth: '1px',
  borderColor: token('color.border.disabled'),
  borderStyle: 'solid',
  borderRadius: '3px',
  textWrap: 'nowrap',
});

export const iconButtonStyles = css({
  cursor: 'pointer',
  padding: '7px 8px',
  borderWidth: '1px',
  borderColor: token('color.border.accent.gray'),
  borderStyle: 'solid',
  borderRadius: '3px',
  textWrap: 'nowrap',
  backgroundColor: token('color.background.neutral'),
  ':hover': {
    backgroundColor: token('color.background.neutral.hovered'),
  },
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
  borderTopLeftRadius: '0 !important',
  borderBottomLeftRadius: '0 !important',
});

export const buttonGroupNotLastStyles = css({
  borderTopRightRadius: '0 !important',
  borderBottomRightRadius: '0 !important',
});

export const buttonGroupStyles = css({
  display: 'inline-flex',
  alignItems: 'center',
});
