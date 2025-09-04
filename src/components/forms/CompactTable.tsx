import React from 'react';

import { RowType } from '@atlaskit/dynamic-table/types';
import { HeadType } from '@atlaskit/dynamic-table/types';
import { SortOrderType } from '@atlaskit/dynamic-table/types';
import DynamicTable from '@atlaskit/dynamic-table';

const rowsPerPageOptions = [5, 10, 20, 50, 100];

export interface CompactTableSettings {
  currentPage: number;
  rowsPerPage: number;
  sortKey: string | undefined;
  sortOrder: SortOrderType | undefined;
}

export const defaultCompactTableSettings = {
  currentPage: 1,
  rowsPerPage: 5,
  sortKey: undefined,
  sortOrder: undefined,
};

interface CompactTableProps {
  settings: CompactTableSettings;
  onSettingsChange: (updated: Partial<CompactTableSettings>) => void;
  head: HeadType;
  rows: RowType[];
  onRankEnd: (sourceIndex: number, destinationIndex: number) => void;
}

const CompactTable: React.FC<CompactTableProps> = ({ settings, onSettingsChange, head, rows, onRankEnd }) => {
  const [editVersion, setEditVersion] = React.useState(0);

  return (
    <div className="compact-table-wrapper">
      <DynamicTable
        caption={false}
        label="compact-table"
        key={`compact-table-${editVersion}`}
        head={head}
        rows={rows}
        page={settings.currentPage}
        defaultPage={1}
        rowsPerPage={settings.rowsPerPage}
        // isRankable
        isFixedSize
        onSetPage={(page) => onSettingsChange({ currentPage: page })}
        sortKey={settings.sortKey}
        sortOrder={settings.sortOrder}
        onSort={(data) => {
          if (data.key) {
            onSettingsChange({ sortKey: data.key, sortOrder: data.sortOrder });
          } else {
            onSettingsChange({ sortKey: undefined, sortOrder: undefined });
            // FIXME: workaround for DynamicTable not updating on unsort
            setEditVersion((v) => v + 1);
          }
        }}
        onRankEnd={({ sourceIndex, destination }) => {
          if (destination === undefined) return;
          if (sourceIndex == destination.index) return;

          const i = (settings.currentPage - 1) * settings.rowsPerPage + sourceIndex;
          const j = (settings.currentPage - 1) * settings.rowsPerPage + destination.index;
          onRankEnd(i, j);
        }}
      />
    </div>
  );
};

export default CompactTable;
