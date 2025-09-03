import React, { Fragment } from 'react';
import { createPortal } from 'react-dom';
import invariant from 'tiny-invariant';

import { RowCellType, RowType } from './types';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { DragHandleButton } from '@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button';
import { css, jsx } from '@emotion/react';
import { TableContext, TableContextValue } from './table-context';
import * as liveRegion from '@atlaskit/pragmatic-drag-and-drop-live-region';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { attachClosestEdge, type Edge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { RowMenuButton } from './menu-button';
import DropdownMenu, { DropdownItemGroup } from '@atlaskit/dropdown-menu';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { minColumnWidth } from './constants';

const rowStyles = xcss({
  position: 'relative',
});

const textOverflowStyles = xcss({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  borderWidth: 'border.width.0',
  borderBottomWidth: token('border.width', '1px'),
  borderStyle: 'solid',
  borderColor: 'color.border',
});

type State =
  | {
      type: 'idle';
    }
  | {
      type: 'is-over';
      closestEdge: Edge | null;
    };

// The column button has a bit more spacing than the row button,
// to avoid conflict with the resize handle
const columnMenuButtonWrapperStyles = css({
  right: 12,
});

type ItemEntry = { itemId: string; element: HTMLElement };

function getItemRegistry() {
  const registry = new Map<string, HTMLElement>();

  function register({ itemId, element }: ItemEntry) {
    registry.set(itemId, element);

    return function unregister() {
      registry.delete(itemId);
    };
  }

  function getElement(itemId: string): HTMLElement | null {
    return registry.get(itemId) ?? null;
  }

  return { register, getElement };
}

const Row = React.memo(function Row({
  cells,
  rowIndex,
  isDraggable,
}: {
  cells: RowCellType[];
  rowIndex: number;
  isDraggable: boolean;
}) {
  const ref = React.useRef<HTMLTableRowElement | null>(null);
  const dragHandleRef = React.useRef<HTMLButtonElement>(null);
  const { instanceId } = React.useContext(TableContext);
  const [state, setState] = React.useState<State>({ type: 'idle' });

  // cleanup the live region when this component is finished
  React.useEffect(() => {
    return function cleanup() {
      liveRegion.cleanup();
    };
  }, []);

  // pragmatic drag and drop
  React.useEffect(() => {
    const element = ref.current;
    invariant(element);
    const dragHandle = dragHandleRef.current;
    invariant(dragHandle);
    return combine(
      draggable({
        element,
        dragHandle,
        getInitialData() {
          return { rowIndex, instanceId };
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          return source.data.instanceId === instanceId && source.data.rowIndex !== rowIndex;
        },
        getData({ input, element }) {
          const data = { cells, rowIndex };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
        onDragEnter(args) {
          setState({
            type: 'is-over',
            closestEdge: extractClosestEdge(args.self.data),
          });
        },
        onDrag(args) {
          const closestEdge: Edge | null = extractClosestEdge(args.self.data);

          // only update react state if the `closestEdge` changes
          setState((current) => {
            if (current.type !== 'is-over') {
              return current;
            }
            if (current.closestEdge === closestEdge) {
              return current;
            }
            return {
              type: 'is-over',
              closestEdge,
            };
          });
        },
        onDragLeave() {
          setState({ type: 'idle' });
        },
        onDrop() {
          setState({ type: 'idle' });
        },
      })
    );
  }, [instanceId, cells, rowIndex]);

  return (
    <Fragment>
      <Box as="tr" key={rowIndex} draggable={isDraggable} ref={ref} xcss={rowStyles}>
        {cells.map((cell, columnIndex) => (
          <Box as="td" key={cell.key} xcss={textOverflowStyles}>
            {
              /* Rendering this in only the first column of each row */
              columnIndex === 0 && <RowMenuButton ref={dragHandleRef} rowIndex={rowIndex} />
            }
            {cell.content}
            {state.type === 'is-over' && state.closestEdge ? <DropIndicator edge={state.closestEdge} type="no-terminal" /> : null}
          </Box>
        ))}
      </Box>
    </Fragment>
  );
});

export default Row;
