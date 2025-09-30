import { forwardRef, useCallback, useContext } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
// eslint-disable-next-line @atlaskit/design-system/no-banned-imports
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { DragHandleButton } from '@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button';

import { TableContext } from './table-context';
import { useTranslation } from 'react-i18next';

const baseMenuButtonWrapperStyles = css({
  width: 'max-content',
  height: '100%',
  position: 'absolute',
  top: 0,
  display: 'grid',
  alignContent: 'center',
  gridTemplateRows: '24px',
});

const rowMenuButtonWrapperStyles = css({
  left: 8,
});

export const RowMenuButton = forwardRef<
  HTMLButtonElement,
  {
    rowIndex: number;
  }
>(function RowMenuButton({ rowIndex }, ref) {
  const { t: translate } = useTranslation('translation', { keyPrefix: 'table' });
  const t = translate as (s: string, o?: Record<string, string | boolean>) => string;
  const { reorderItem, numberOfRows } = useContext(TableContext);

  const moveToTop = useCallback(() => {
    reorderItem({ startIndex: rowIndex, indexOfTarget: 0 });
  }, [reorderItem, rowIndex]);

  const moveUp = useCallback(() => {
    reorderItem({ startIndex: rowIndex, indexOfTarget: rowIndex - 1 });
  }, [reorderItem, rowIndex]);

  const moveDown = useCallback(() => {
    reorderItem({ startIndex: rowIndex, indexOfTarget: rowIndex + 1 });
  }, [reorderItem, rowIndex]);

  const moveToBottom = useCallback(() => {
    reorderItem({ startIndex: rowIndex, indexOfTarget: numberOfRows - 1 });
  }, [reorderItem, rowIndex]);

  const isFirstRow = rowIndex === 0;
  const isLastRow = rowIndex === numberOfRows - 1;

  return (
    <div css={[baseMenuButtonWrapperStyles, rowMenuButtonWrapperStyles]}>
      <DropdownMenu
        trigger={({ triggerRef, ...triggerProps }) => (
          <DragHandleButton ref={mergeRefs([ref, triggerRef])} {...triggerProps} label="Reorder" />
        )}
      >
        <DropdownItemGroup>
          <DropdownItem isDisabled={isFirstRow} onClick={moveToTop}>
            {t('move_to_top')}
          </DropdownItem>
          <DropdownItem isDisabled={isFirstRow} onClick={moveUp}>
            {t('move_up')}
          </DropdownItem>
          <DropdownItem isDisabled={isLastRow} onClick={moveDown}>
            {t('move_down')}
          </DropdownItem>
          <DropdownItem isDisabled={isLastRow} onClick={moveToBottom}>
            {t('move_to_bottom')}
          </DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>
    </div>
  );
});
