import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

export const rootStyles = css({
  display: 'grid',
  grid: 'auto 1fr',
  gridTemplateAreas: `
  "top-nav top-nav top-nav"
  "side-nav main aside"
`,
  height: '100vh',
});

export const topNavStyles = css({
  gridArea: 'top-nav',
  position: 'sticky',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 100,
});

// TODO: Support overlay.
export const sideNavStyles = css({
  gridArea: 'side-nav',
  position: 'fixed',
  left: 0,
  overflowY: 'auto',

  // Border
  borderInlineStart: 'none',
  borderInlineEnd: `1px solid ${token('color.border')}`,

  // Animation
  transition: 'width 0.3s ease',
  overflowX: 'hidden',
  whiteSpace: 'nowrap',
});

export const sideNavHidden = css({
  width: 0,
});

export const mainStyles = css({
  gridArea: 'main',
});
