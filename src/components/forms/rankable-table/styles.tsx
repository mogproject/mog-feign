import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { xcss } from '@atlaskit/primitives';

export const scrollableStyles = xcss({
  height: '50vh',
  overflowY: 'scroll',
  overflowX: 'visible',
});

export const tableStyles = css({
  tableLayout: 'fixed',
  // We don't want to collapse borders - otherwise the border on the header
  // will disappear with position:sticky
  // https://stackoverflow.com/questions/50361698/border-style-do-not-work-with-sticky-position-element
  borderCollapse: 'separate',
  borderSpacing: 0,

  // Adding a bit more space to the first column for consistency and to give room
  // for the drop indicator and the drag handle
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
  'th:first-of-type, td:first-of-type': {
    paddingLeft: 40,
  },
});

export const tableHeaderStyles = xcss({
  background: token('elevation.surface', '#FFF'),
  // borderBottom: '0px solid',
  position: 'sticky',
  top: 'space.0',
  // zIndex: 2 is needed so that the sticky header will sit on top of our
  // row items, which need to have `position:relative` applied so they can render
  // the drop indicators
  // Using zIndex:2 rather than zIndex: 1 as our drop indicator uses zIndex: 1
  // and we want the header to always be on top of the drop indicator
  zIndex: 'card',  // use 100 instead of 2
});

export const rowStyles = css({
  // Needed for our drop indicator
  position: 'relative',
  '&:hover': {
    background: token('color.background.input.hovered', 'red'),
  },
});
