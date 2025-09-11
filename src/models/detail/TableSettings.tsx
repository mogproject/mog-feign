import { SortOrderType } from '../../components/forms/rankable-table/types';

interface TableSettings {
  sortKey: string | null;
  sortOrder: SortOrderType | null;
}

export default TableSettings;
