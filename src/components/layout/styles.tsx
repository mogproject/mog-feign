import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

export const rootStyles = css({
  height: '100vh',
});

export const topNavStyles = css({
  position: 'sticky',
  top: 0,
  zIndex: 100,
});

// TODO: Support overlay.
export const sideBarStyles = css({
  top: '0',
  position: 'sticky',
  minHeight: 0,
  overflowX: 'hidden',
  overflowY: 'auto',

  // Animation
  transition: 'width 0.3s ease',
  whiteSpace: 'nowrap',
});

export const sideNavStyles = css({
  // Border
  borderInlineStart: 'none',
  borderInlineEnd: `1px solid ${token('color.border')}`,
});

export const sideNavHidden = css({
  width: 0,
});

export const mainStyles = css({
  flex: '1',
});

export const asideStyles = css({
  // Border
  borderInlineStart: `1px solid ${token('color.border')}`,
  borderInlineEnd: 'none',
});

export const footerStyles = css({
  borderBlockStart: `1px solid ${token('color.border.bold')}`,
})
