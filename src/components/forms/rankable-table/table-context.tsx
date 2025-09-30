import { createContext } from 'react';

import type { ReorderFunction, SortOrderType } from './types';

export type TableContextValue = {
  reorderItem: ReorderFunction;
  instanceId: symbol | null;
  numberOfRows: number;
  numberOfColumns: number;
  sortKey: string | null;
  sortOrder: SortOrderType | null;
};

export const TableContext = createContext<TableContextValue>({
  reorderItem: () => {},
  instanceId: null,
  numberOfRows: 0,
  numberOfColumns: 0,
  sortKey: null,
  sortOrder: null,
});
