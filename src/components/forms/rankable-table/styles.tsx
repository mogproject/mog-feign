import { css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { xcss } from '@atlaskit/primitives';
import { firstColumnAdditionalPadding } from './constants';

export const scrollableStyles = xcss({
  overflowY: 'scroll',
  overflowX: 'visible',
  paddingLeft: 'space.050', // add space for DropIndicator

  border: `1px solid ${token('color.border')}`,
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
    paddingLeft: firstColumnAdditionalPadding,
  },
});

export const tableHeaderStyles = xcss({
  background: token('elevation.surface', '#FFF'),
  position: 'sticky',
  top: 'space.0',
  height: token('space.400'),
  zIndex: '1',
});

export const rowStyles = css({
  position: 'relative',
  '&:hover': {
    background: token('color.background.input.hovered'),
  },
});

export const fadedRowStyles = xcss({
  opacity: 0.4,
});

export const rowDataStyles = xcss({
  paddingTop: '0',
  paddingBottom: '0',
  borderWidth: 'border.width.0',
  borderBottomWidth: token('border.width', '1px'),
  borderStyle: 'solid',
  borderColor: 'color.border',
});

export const textOverflowStyles = xcss({
  width: '100%',
  height: '100%',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
