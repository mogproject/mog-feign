import React from 'react';
import invariant from 'tiny-invariant';

import { RowCellType } from './types';
import { TableContext } from './table-context';
import * as liveRegion from '@atlaskit/pragmatic-drag-and-drop-live-region';
import { attachClosestEdge, type Edge, extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { RowMenuButton } from './menu-button';
import { Box } from '@atlaskit/primitives';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { fadedRowStyles, rowDataStyles, rowStyles, textOverflowStyles } from './styles';

type State =
  | {
      type: 'idle';
    }
  | {
      type: 'dragging';
    }
  | {
      type: 'is-over';
      closestEdge: Edge | null;
    };

const Row = React.memo(function Row({
  cells,
  rowIndex,
  rowRef,
}: {
  cells: RowCellType[];
  rowIndex: number;
  rowRef: React.RefObject<HTMLTableRowElement | null> | undefined;
}) {
  const ref = React.useRef<HTMLTableRowElement>(null);
  const dragHandleRef = React.useRef<HTMLButtonElement>(null);
  const { instanceId, sortKey } = React.useContext(TableContext);
  const [state, setState] = React.useState<State>({ type: 'idle' });
  const isDraggable = sortKey === null;

  // Synchronize refs.
  React.useEffect(() => {
    if (rowRef) rowRef.current = ref.current;
  }, [rowRef]);

  // cleanup the live region when this component is finished
  React.useEffect(() => {
    return function cleanup() {
      liveRegion.cleanup();
    };
  }, []);

  // pragmatic drag and drop
  React.useEffect(() => {
    if (!isDraggable) return;

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
        onDragStart() {
          setState({ type: 'dragging' });
        },
        onDrop() {
          setState({ type: 'idle' });
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
  }, [instanceId, cells, rowIndex, isDraggable]);

  return (
    <tr draggable={isDraggable} ref={ref} css={rowStyles}>
      {cells.map((cell, columnIndex) => (
        <Box as="td" key={columnIndex} xcss={rowDataStyles}>
          {
            /* Rendering this in only the first column of each row */
            columnIndex === 0 && isDraggable && <RowMenuButton ref={dragHandleRef} rowIndex={rowIndex} />
          }
          <Box xcss={[textOverflowStyles, state.type === 'dragging' && fadedRowStyles]}>{cell.content}</Box>
          {state.type === 'is-over' && state.closestEdge ? <DropIndicator edge={state.closestEdge} gap="0px" /> : null}
        </Box>
      ))}
    </tr>
  );
});

export default Row;
