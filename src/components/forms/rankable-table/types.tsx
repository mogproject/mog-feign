import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';

export type ReorderFunction = (args: { startIndex: number; indexOfTarget: number; closestEdgeOfTarget?: Edge | null }) => void;

export interface RowCellType {
  /**
   * Key to resolve sorting this cell in its column.
   */
  key?: string | number;
  /**
   * The content of the cell.
   */
  content?: React.ReactNode | string;
}

export interface HeadCellType {
  key: string;
  content: React.ReactNode | string;
  /** Whether the column the cell sits above is sortable. */
  isSortable?: boolean;
}

export interface HeadType {
  cells: Array<HeadCellType>;
}

export interface RowType extends React.ComponentPropsWithoutRef<'tr'> {
  cells: Array<RowCellType>;
  ref?: React.Ref<HTMLTableRowElement>;
}

/**
 * Enum style type to determine whether sort results are ascending or descending.
 */
export type SortOrderType = 'ASC' | 'DESC';

export interface RankableTableState {
  sortKey: string | undefined;
  sortOrder: SortOrderType | undefined;
}
