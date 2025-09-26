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

export const sideNavHidden = css({
  width: 0,
});

export const mainStyles = css({
  flex: '1',
});

export const footerStyles = css({
  borderBlockStart: `1px solid ${token('color.border.bold')}`,
});
