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
  /** Key that is unique among the columns. */
  key: string;

  /** Header content. */
  content: React.ReactNode | string;

  /** Whether the column the cell sits above is sortable. */
  isSortable?: boolean;

  /** Default width of the column in pixels. */
  defaultWidth?: number;
}

export interface HeadType {
  cells: Array<HeadCellType>;
}

export interface RowType extends React.ComponentPropsWithoutRef<'tr'> {
  cells: Array<RowCellType>;
  ref?: React.RefObject<HTMLTableRowElement | null>;
}

/**
 * Enum style type to determine whether sort results are ascending or descending.
 */
export type SortOrderType = 'ASC' | 'DESC';

export interface RankableTableState {
  sortKey: string | undefined;
  sortOrder: SortOrderType | undefined;
}
