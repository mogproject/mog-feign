import React from 'react';

import { IconButton, IconButtonProps } from '@atlaskit/button/new';
import { type NewCoreIconProps } from '@atlaskit/icon';
import SidebarCollapseIcon from '@atlaskit/icon/core/sidebar-collapse';
import SidebarExpandIcon from '@atlaskit/icon/core/sidebar-expand';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Inline, xcss } from '@atlaskit/primitives';
import { useLayoutState, useLayoutDispatch } from './LayoutContext';

const silentIconStyles = xcss({
  display: 'contents',
  pointerEvents: 'none',
});

type SideNavToggleButtonProps = {
  id: string;
  collapseLabel: string;
  expandLabel: string;
};

const SideNavToggleButton: React.FC<SideNavToggleButtonProps> = (props) => {
  const state = useLayoutState();
  const dispatch = useLayoutDispatch();

  const icon = (props: NewCoreIconProps) => (
    <Inline xcss={silentIconStyles}>{state.sideNavExpanded ? <SidebarCollapseIcon {...props} /> : <SidebarExpandIcon {...props} />}</Inline>
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, analyticsEvent: UIAnalyticsEvent) => {
      if (dispatch === undefined) return;
      dispatch((prev) => ({ ...prev, sideNavExpanded: !prev.sideNavExpanded }));
    },
    [dispatch, state.sideNavExpanded]
  );
  const toggleButtonTooltipOptions: IconButtonProps['tooltip'] = {
    // We're disabling pointer events on the tooltip to prevent it from blocking mouse events, so that the side nav flyout stays open
    // when moving the mouse from the top bar to the side nav.
    ignoreTooltipPointerEvents: true,
  };

  return state.showSideNav ? (
    <IconButton
      id={props.id}
      appearance="subtle"
      label={state.sideNavExpanded ? props.collapseLabel : props.expandLabel}
      icon={icon}
      onClick={handleClick}
      isTooltipDisabled={false}
      tooltip={toggleButtonTooltipOptions}
    />
  ) : (
    <></>
  );
};

export default SideNavToggleButton;
