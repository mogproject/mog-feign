import React from 'react';
import invariant from 'tiny-invariant';

import { scrollableStyles, tableHeaderStyles, tableStyles } from './styles';
import { HeadType, ReorderFunction, RowType, SortOrderType } from './types';
import Row from './row';
import { Box } from '@atlaskit/primitives';
import TableHeader from './table-header';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import { TableContext } from './table-context';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
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
  sortKey: string | null;
  sortOrder: SortOrderType | null;
  onSort: (sortKey: string | null, sortOrder: SortOrderType | null) => void;
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
      setLastOperation(null);
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

  const sortColumnIndex = props.head.cells.findIndex((cell) => cell.key === props.sortKey);
  const rowCompare = React.useCallback(
    (a: RowType, b: RowType) => {
      invariant(sortColumnIndex >= 0);
      const coef = props.sortOrder === 'DESC' ? -1 : 1;

      const akey = a.cells[sortColumnIndex]?.key;
      const bkey = b.cells[sortColumnIndex]?.key;

      // undefined は常に最後に回す
      if (akey === undefined && bkey === undefined) return 0;
      if (akey === undefined) return 1;
      if (bkey === undefined) return -1;

      // 数値の場合は数値として比較、それ以外は文字列として比較
      const aValue = typeof akey === 'number' ? akey : String(akey);
      const bValue = typeof bkey === 'number' ? bkey : String(bkey);

      if (aValue < bValue) return -1 * coef;
      if (aValue > bValue) return 1 * coef;
      return 0;
    },
    [sortColumnIndex, props.sortOrder]
  );
  const sortedRows = props.sortKey === null ? props.rows : [...props.rows].sort(rowCompare);

  // Context
  const contextValue = React.useMemo(() => {
    return {
      instanceId,
      reorderItem,
      numberOfRows: props.rows.length,
      numberOfColumns: props.head.cells.length,
      sortKey: props.sortKey,
      sortOrder: props.sortOrder,
    };
  }, [instanceId, reorderItem, props.rows.length, props.head.cells.length, props.sortKey, props.sortOrder]);

  return (
    <TableContext.Provider value={contextValue}>
      <Box ref={scrollableRef} xcss={scrollableStyles}>
        <table ref={tableRef} css={tableStyles}>
          <Box as="thead" xcss={tableHeaderStyles}>
            <tr>
              {props.head.cells.map((cell, colIndex) => (
                <TableHeader
                  key={colIndex}
                  cell={cell}
                  index={colIndex}
                  sortKey={props.sortKey}
                  sortOrder={props.sortOrder}
                  onSort={props.onSort}
                />
              ))}
            </tr>
          </Box>
          <tbody ref={tbodyRef}>
            {sortedRows.map((row, rowIndex) => (
              <Row key={rowIndex} cells={row.cells} rowIndex={rowIndex} />
            ))}
          </tbody>
        </table>
      </Box>
    </TableContext.Provider>
  );
};

export default RankableTable;
