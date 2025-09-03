import { forwardRef, useCallback, useContext } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
// eslint-disable-next-line @atlaskit/design-system/no-banned-imports
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { fg } from '@atlaskit/platform-feature-flags';
import { DragHandleButton } from '@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button';

import { TableContext } from './table-context';

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
  const { reorderItem, numberOfRows } = useContext(TableContext);

  const moveUp = useCallback(() => {
    reorderItem({
      startIndex: rowIndex,
      indexOfTarget: rowIndex - 1,
    });
  }, [reorderItem, rowIndex]);

  const moveDown = useCallback(() => {
    reorderItem({
      startIndex: rowIndex,
      indexOfTarget: rowIndex + 1,
    });
  }, [reorderItem, rowIndex]);

  const isFirstRow = rowIndex === 0;
  const isLastRow = rowIndex === numberOfRows - 1;

  return (
    <div css={[baseMenuButtonWrapperStyles, rowMenuButtonWrapperStyles]}>
      <DropdownMenu
        trigger={({ triggerRef, ...triggerProps }) => (
          <DragHandleButton ref={mergeRefs([ref, triggerRef])} {...triggerProps} label="Reorder" />
        )}
        shouldRenderToParent={fg('should-render-to-parent-should-be-true-design-syst')}
      >
        <DropdownItemGroup>
          <DropdownItem isDisabled={isFirstRow} onClick={moveUp}>
            Move up
          </DropdownItem>
          <DropdownItem isDisabled={isLastRow} onClick={moveDown}>
            Move down
          </DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>
    </div>
  );
});
