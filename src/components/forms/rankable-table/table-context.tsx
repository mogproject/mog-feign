import { createContext } from 'react';

import type { ItemRegistration, ReorderFunction } from './types';

type UnregisterFn = () => void;

export type TableContextValue = {
  reorderItem: ReorderFunction;
  // register: (args: ItemRegistration) => UnregisterFn;
  instanceId: symbol | null;
  numberOfRows: number;
  sortKey: string | null;
};

export const TableContext = createContext<TableContextValue>({
  reorderItem: () => {},
  instanceId: null,
  numberOfRows: 0,
  sortKey: null,
});
