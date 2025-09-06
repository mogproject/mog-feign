import React, { Component } from 'react';
import invariant from 'tiny-invariant';

import { Box, Flex, Inline, Pressable, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { preventUnhandled } from '@atlaskit/pragmatic-drag-and-drop/prevent-unhandled';
import { minColumnWidth, firstColumnAdditionalPadding } from './constants';
import { B100, N300, N30A, N40 } from '@atlaskit/theme/colors';
import Tooltip from '@atlaskit/tooltip';

import { HeadCellType, SortOrderType } from './types';
import { TableContext } from './table-context';
import { useTranslation } from 'react-i18next';
import SortIndicator from './SortIndicator';

const buttonWrapperStyles = xcss({
  display: 'block',
  minHeight: '20px',
  width: '100%',
  alignItems: 'center',
  padding: '0',
  backgroundColor: 'transparent' as any,
  fontWeight: 'inherit',
  overflow: 'hidden',
});

const headCellContainerStyles = xcss({
  display: 'block',
  alignItems: 'center',
  fontWeight: 'inherit',
});

const onClickStyles = xcss({
  cursor: 'pointer',
  backgroundColor: 'color.background.neutral.subtle.hovered',
});

type HeaderState =
  | {
      type: 'idle';
    }
  | {
      type: 'resizing';
      initialWidth: number;
      tableWidth: number;
      nextHeaderInitialWidth: number;
      nextHeader: HTMLElement;
      maxWidth: number;
      minWidth: number;
    };

type ColumnType = 'first-of-many' | 'middle-of-many' | 'last-of-many' | 'only-column';

const resizerStyles = css({
  '--local-hitbox-width': token('space.300', '24px'),
  width: 'var(--local-hitbox-width)',
  cursor: 'col-resize',
  flexGrow: '0',
  position: 'absolute',
  zIndex: 1, // we want this to sit on top of adjacent column headers
  right: 'calc(-1 * calc(var(--local-hitbox-width) / 2))',
  top: 0,
  height: 'var(--table-height)',

  // eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
  '::before': {
    opacity: 0,
    '--local-line-width': token('border.width', '2px'),
    content: '""',
    position: 'absolute',
    background: token('color.border.brand', '#0052CC'),
    // Jesse would like us to use 'color.border' for hover, then brand while resizing
    // However,
    // - right now that is inconsistent with our sidebar
    // - we get a bad outcome when the borders overlap with the header border
    width: 'var(--local-line-width)',
    inset: 0,
    left: `calc(50% - calc(var(--local-line-width) / 2))`,
    transition: 'opacity 0.2s ease',
  },

  // eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
  ':hover::before': {
    opacity: 1,
  },
});

// const headerDraggingStyles = xcss({
//   background: token('color.background.disabled', '#091E4224'),
//   color: 'color.text.disabled',
// });

const resizingStyles = css({
  // turning off the resizing cursor as sometimes it can cause the cursor to flicker
  // while resizing. The browser controls the cursor while dragging, but the browser
  // can sometimes bug out.
  cursor: 'unset',
  // eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
  '::before': {
    opacity: 1,
  },
});

const thStyles = xcss({
  borderBottom: `2px solid ${token('color.border')}`,
  // Need position:relative so our drop indicator (which uses position:absolute) can be
  // correctly positioned inside
  position: 'relative',
  // using border box sizing as that is what we will be applying as the width for `--local-resizing-width`
  boxSizing: 'border-box',
  width: 'var(--local-resizing-width)',

  minHeight: '20px',
  verticalAlign: 'middle',
  paddingTop: 'space.050',
  paddingBottom: 'space.0',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const idleState: HeaderState = { type: 'idle' };

//------------------------------------------------------------------------------
//    Utility Functions
//------------------------------------------------------------------------------
function getColumnType(index: number, numColumns: number): ColumnType {
  if (numColumns === 1) {
    return 'only-column';
  } else if (index === 0) {
    return 'first-of-many';
  } else if (index === numColumns - 1) {
    return 'last-of-many';
  } else {
    return 'middle-of-many';
  }
}

function clamp({ value, min, max }: { value: number; min: number; max: number }) {
  return Math.max(min, Math.min(value, max));
}

//------------------------------------------------------------------------------
//    Props
//------------------------------------------------------------------------------

interface TableHeaderProps {
  cell: HeadCellType;
  index: number;
  sortKey: string | null;
  sortOrder: SortOrderType | null;
  onSort: (sortKey: string | null, sortOrder: SortOrderType | null) => void;
  testId?: string;
}

//------------------------------------------------------------------------------
//    TableHeader
//------------------------------------------------------------------------------
const TableHeader: React.FC<TableHeaderProps> = ({ cell, index, sortKey, sortOrder, onSort, testId }) => {
  const ref = React.useRef<HTMLTableCellElement | null>(null);
  const resizerRef = React.useRef<HTMLDivElement | null>(null);
  const [state, setState] = React.useState<HeaderState>(idleState);
  const { numberOfColumns } = React.useContext(TableContext);
  const [hovered, setHovered] = React.useState(false);

  const { t: translate } = useTranslation('translation', { keyPrefix: 'table' });
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;

  const columnType = getColumnType(index, numberOfColumns);

  const renderResizeHandle: boolean =
    (state.type === 'idle' || state.type === 'resizing') && (columnType === 'first-of-many' || columnType === 'middle-of-many');

  // Setting up the draggable resize handle
  // How resizing works:
  // 1. change the size of the column header being dragged
  // 2. we change the _next_ column header by the opposite amount
  React.useEffect(() => {
    if (!renderResizeHandle) {
      return;
    }

    const handle = resizerRef.current;
    invariant(handle);
    const header = ref.current;
    invariant(header);

    return draggable({
      element: handle,
      getInitialData() {
        return { type: 'column-resize', index };
      },
      onGenerateDragPreview({ nativeSetDragImage }) {
        disableNativeDragPreview({ nativeSetDragImage });
        preventUnhandled.start();

        const initialWidth = header.getBoundingClientRect().width;
        const minWidth = minColumnWidth + (index === 0 ? firstColumnAdditionalPadding : 0);

        const nextHeader = header.nextElementSibling;
        invariant(nextHeader instanceof HTMLElement);
        const nextHeaderInitialWidth = nextHeader.getBoundingClientRect().width;

        const table = header.closest('table');
        invariant(table);
        const tableWidth = table.getBoundingClientRect().width;

        // We cannot let `nextHeader` get smaller than `minColumnWidth`
        const maxWidth = initialWidth + nextHeaderInitialWidth - minWidth;

        setState({
          type: 'resizing',
          initialWidth,
          tableWidth,
          nextHeaderInitialWidth,
          nextHeader,
          maxWidth,
          minWidth,
        });
      },
      onDrag({ location }) {
        const diffX = location.current.input.clientX - location.initial.input.clientX;

        invariant(state.type === 'resizing');
        const { initialWidth, nextHeaderInitialWidth, nextHeader, maxWidth, minWidth } = state;

        // Set the width of our header being resized
        const proposedWidth = clamp({
          value: initialWidth + diffX,
          min: minWidth,
          max: maxWidth,
        });
        header.style.setProperty('--local-resizing-width', `${proposedWidth}px`);

        // How much did the width of the header actually change?
        const actualDiff = proposedWidth - initialWidth;

        // Now we need to make the opposite change to the next header
        //
        // Example: we have two columns A and B
        // If A is resizing to get larger, B needs to get smaller
        nextHeader.style.setProperty('--local-resizing-width', `${nextHeaderInitialWidth - actualDiff}px`);
      },
      onDrop() {
        preventUnhandled.stop();
        setState(idleState);
      },
    });
  }, [renderResizeHandle, index, state]);

  // Sort button.
  // const sortButton = <IconButton appearance="subtle" icon={ArrowDownIcon} label="昇順にソート" spacing="compact" />;
  const onClick = React.useCallback(() => {
    if (sortKey === cell.key) {
      if (sortOrder === 'ASC') {
        onSort(sortKey, 'DESC');
      } else if (sortOrder === 'DESC') {
        onSort(null, null); // reset sorting
      } else {
        invariant(false, 'never happens');
      }
    } else {
      onSort(cell.key, 'ASC');
    }
  }, [sortKey, sortOrder]);

  const currentOrder = sortKey === cell.key ? sortOrder : null;

  const contentWithSortButton = (
    <Tooltip content={sortOrder === null ? '' : sortOrder === 'ASC' ? t('ascending_sort') : t('descending_sort')}>
      <Pressable
        onClick={onClick}
        xcss={[buttonWrapperStyles, hovered && onClickStyles]}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-roledescription={t('sort_button')}
      >
        <Inline space="space.0" alignInline="center" spread="space-between">
          {cell.content}
          <SortIndicator order={currentOrder} />
        </Inline>
      </Pressable>
    </Tooltip>
  );

  return (
    <Box as="th" ref={ref} xcss={thStyles} key={index}>
      {/* Content */}
      {cell.isSortable ? contentWithSortButton : cell.content}

      {/* Resizer */}
      {renderResizeHandle && <div ref={resizerRef} css={[resizerStyles, state.type === 'resizing' ? resizingStyles : undefined]}></div>}
    </Box>
  );
};

export default TableHeader;
