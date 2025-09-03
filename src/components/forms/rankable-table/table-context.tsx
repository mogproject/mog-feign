import { createContext } from 'react';

import type { ItemRegistration, ReorderFunction } from './types';

type UnregisterFn = () => void;

export type TableContextValue = {
  reorderItem: ReorderFunction;
  // register: (args: ItemRegistration) => UnregisterFn;
  instanceId: symbol | null;
  numberOfRows: number;
};

export const TableContext = createContext<TableContextValue>({
  reorderItem: () => {},
  // register: function register() {
  //   return function unregister() {};
  // },
  instanceId: null,
  numberOfRows: 0,
});
