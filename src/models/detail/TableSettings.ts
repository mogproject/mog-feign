import { SortOrderType } from '../../components/rankable-table/types';

interface TableSettings {
  sortKey: string | null;
  sortOrder: SortOrderType | null;
}

export default TableSettings;
