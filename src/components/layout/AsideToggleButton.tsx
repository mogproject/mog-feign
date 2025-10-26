import React from 'react';

import { IconButton, IconButtonProps } from '@atlaskit/button/new';
import { type NewCoreIconProps } from '@atlaskit/icon';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Inline, xcss } from '@atlaskit/primitives';
import { useLayoutState, useLayoutDispatch } from './LayoutContext';

import MinimizeIcon from '@atlaskit/icon/core/minimize';
import MaximizeIcon from '@atlaskit/icon/core/maximize';

const silentIconStyles = xcss({
  display: 'contents',
  pointerEvents: 'none',
});

type AsideToggleButtonProps = {
  id: string;
  appearance?: 'default' | 'primary' | 'discovery' | 'subtle' | undefined;
  collapseLabel: string;
  expandLabel: string;
};

const AsideToggleButton: React.FC<AsideToggleButtonProps> = (props) => {
  const state = useLayoutState();
  const dispatch = useLayoutDispatch();

  const icon = (props: NewCoreIconProps) => (
    <Inline xcss={silentIconStyles}>{state.showAside ? <MinimizeIcon {...props} /> : <MaximizeIcon {...props} />} </Inline>
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, analyticsEvent: UIAnalyticsEvent) => {
      if (dispatch === undefined) return;
      dispatch((prev) => ({ ...prev, showAside: !prev.showAside }));
    },
    [dispatch, state.showAside]
  );
  const toggleButtonTooltipOptions: IconButtonProps['tooltip'] = {
    // We're disabling pointer events on the tooltip to prevent it from blocking mouse events, so that the side nav flyout stays open
    // when moving the mouse from the top bar to the side nav.
    ignoreTooltipPointerEvents: true,
  };

  return (
    <IconButton
      id={props.id}
      appearance={props.appearance}
      label={state.showAside ? props.collapseLabel : props.expandLabel}
      icon={icon}
      spacing="compact"
      onClick={handleClick}
      isTooltipDisabled={false}
      tooltip={toggleButtonTooltipOptions}
    />
  );
};

export default AsideToggleButton;
