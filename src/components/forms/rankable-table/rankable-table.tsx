import React, { Fragment, type Ref } from 'react';
import invariant from 'tiny-invariant';

import { css, jsx } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { rowStyles, scrollableStyles, tableHeaderStyles, tableStyles } from './styles';
import { HeadType, ItemRegistration, ReorderFunction, RowType, SortOrderType } from './types';
import Row from './row';
import { Box } from '@atlaskit/primitives';
import TableHeader from './table-header';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { TableContext } from './table-context';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';

//------------------------------------------------------------------------------
//    Utility Functions
//------------------------------------------------------------------------------
function extractIndex(data: Record<string, unknown>) {
  const { rowIndex } = data;
  if (typeof rowIndex !== 'number') {
    return null;
  }
  return rowIndex;
}

//------------------------------------------------------------------------------
//    Types
//------------------------------------------------------------------------------
type Operation = {
  type: 'row-reorder';
  currentIndex: number;
};

//------------------------------------------------------------------------------
//    Props
//------------------------------------------------------------------------------
interface RankableTableProps {
  head: HeadType;
  rows: RowType[];
  onRankEnd: (sourceIndex: number, destinationIndex: number) => void;
  sortKey?: string;
  sortOrder?: SortOrderType;
}

//------------------------------------------------------------------------------
//    Components
//------------------------------------------------------------------------------

const RankableTable: React.FC<RankableTableProps> = (props) => {
  // Elements
  const tableRef = React.useRef<HTMLTableElement | null>(null);
  const scrollableRef = React.useRef<HTMLDivElement | null>(null);
  const tbodyRef = React.useRef<HTMLTableSectionElement | null>(null);
  const [instanceId] = React.useState(() => Symbol('instance-id'));

  const [lastOperation, setLastOperation] = React.useState<Operation | null>(null);

  // Element map
  // const elementMapRef = React.useRef(new Map<number, HTMLElement>());

  // Visible items
  // const observerRef = React.useRef<IntersectionObserver | null>(null);
  // const registrationsRef = React.useRef<Map<Element, ItemRegistration>>(new Map());

  //----------------------------------------------------------------------------
  //    Reordering Functions
  //----------------------------------------------------------------------------
  const reorderItem: ReorderFunction = React.useCallback(({ startIndex, indexOfTarget, closestEdgeOfTarget = null }) => {
    const finishIndex = getReorderDestinationIndex({
      axis: 'vertical',
      startIndex,
      indexOfTarget,
      closestEdgeOfTarget,
    });
    if (startIndex === finishIndex) return; // no change

    props.onRankEnd(startIndex, finishIndex);

    setLastOperation({
      type: 'row-reorder',
      currentIndex: finishIndex,
    });
  }, []);

  //----------------------------------------------------------------------------
  //    Visual Effects After Reordering
  //----------------------------------------------------------------------------
  React.useEffect(() => {
    if (lastOperation === null) {
      return;
    }

    if (lastOperation.type === 'row-reorder') {
      invariant(tbodyRef.current);
      const tr = tbodyRef.current.children[lastOperation.currentIndex] as HTMLTableRowElement;
      if (tr) {
        triggerPostMoveFlash(tr);
      }
      return;
    }
  }, [lastOperation]);

  // Storing the height of the table in a CSS variable
  // This is used by our header resizer and drop target
  React.useEffect(() => {
    const table = tableRef.current;
    invariant(table);
    const height = table.getBoundingClientRect().height + 8;
    table.style.setProperty('--table-height', `${height}px`);

    // be sure to recompute the table height when changes occur that an impact its height
  }, [props.rows]);

  React.useEffect(() => {
    invariant(scrollableRef.current);

    return combine(
      monitorForElements({
        canMonitor({ source }) {
          return source.data.instanceId === instanceId;
        },
        onDrop({ location, source }) {
          /**
           * Only checking the inner-most drop target.
           */
          const destination = location.current.dropTargets[0];
          if (!destination) {
            return;
          }

          const startIndex = extractIndex(source.data);
          const indexOfTarget = extractIndex(destination.data);
          if (startIndex === null || indexOfTarget === null) {
            return;
          }

          const closestEdgeOfTarget = extractClosestEdge(destination.data);
          reorderItem({ startIndex, indexOfTarget, closestEdgeOfTarget });
        },
      }),
      autoScrollForElements({
        element: scrollableRef.current,
        canScroll: () => true,
      })
    );
  }, [instanceId, reorderItem]);

  // Context
  // const register = React.useCallback((registration: ItemRegistration) => {
  //   registrationsRef.current.set(registration.element, registration);
  //   // The `useEffect` of children runs before parents
  //   // so when initially mounting the `IntersectionObserver` will not be ready yet
  //   observerRef.current?.observe(registration.element);

  //   elementMapRef.current.set(registration.index, registration.element);

  //   return function unregister() {
  //     registrationsRef.current.delete(registration.element);
  //     observerRef.current?.unobserve(registration.element);

  //     elementMapRef.current.delete(registration.index);
  //   };
  // }, []);

  const contextValue = React.useMemo(() => {
    return {
      instanceId,
      reorderItem,
      numberOfRows: props.rows.length,
      sortKey: props.sortKey ?? null,
    };
  }, [instanceId, reorderItem, props.rows.length]);
  // }, [reorderItem, register, instanceId]);

  return (
    <TableContext.Provider value={contextValue}>
      <Box ref={scrollableRef} xcss={scrollableStyles}>
        <table ref={tableRef} css={tableStyles}>
          <Box as="thead" xcss={tableHeaderStyles}>
            <tr>
              {props.head.cells.map((cell, colIndex) => (
                <TableHeader key={colIndex} cell={cell} index={colIndex} numColumns={props.head.cells.length} />
              ))}
            </tr>
          </Box>
          <tbody ref={tbodyRef}>
            {props.rows.map((row, rowIndex) => (
              <Row key={rowIndex} cells={row.cells} rowIndex={rowIndex} />
            ))}
          </tbody>
        </table>
      </Box>
    </TableContext.Provider>
  );
};

export default RankableTable;
