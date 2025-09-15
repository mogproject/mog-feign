import React from 'react';
import { LayoutContext, LayoutContextProvider } from './LayoutContext';
import { rootStyles } from './styles';

type RootProps = {
  children: React.ReactNode;
  defaultSideNavWidth: number;
  defaultSideNavExpanded: boolean;
  defaultAsideWidth: number;
};

const Root: React.FC<RootProps> = (props: RootProps) => {
  const state = React.useContext(LayoutContext);
  const columnValue = React.useMemo(() => {
    return state ? `${state.sideNavWidth}px 1fr ${state.asideWidth}px` : '';
  }, [state?.sideNavWidth, state?.asideWidth]);

  return (
    <LayoutContextProvider
      defaultSideNavWidth={props.defaultSideNavWidth}
      defaultSideNavExpanded={props.defaultSideNavExpanded}
      defaultAsideWidth={props.defaultAsideWidth}
    >
      <div
        css={[
          rootStyles,
          {
            gridTemplateColumns: columnValue,
          },
        ]}
      >
        {props.children}
      </div>
    </LayoutContextProvider>
  );
};

export default Root;
