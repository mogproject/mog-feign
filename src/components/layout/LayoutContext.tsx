import React from 'react';
import invariant from 'tiny-invariant';

type LayoutState = {
  /** Height of the top nav section. */
  topNavHeight: number;

  /** Default width of the side nav section. */
  defaultSideNavWidth: number;

  /** Width of the side nav section. */
  sideNavWidth: number;

  /** The side nav is expanded when true, and collapsed when false. */
  sideNavExpanded: boolean;

  /** Width of the aside section. */
  asideWidth: number;
};

type LayoutAction = (prev: LayoutState) => LayoutState;

// Contexts.
const LayoutContext = React.createContext<LayoutState | undefined>(undefined);
const LayoutDispatch = React.createContext<React.Dispatch<LayoutAction> | undefined>(undefined);

// Helper functions.
export function useLayoutState(): LayoutState {
  const context = React.useContext(LayoutContext);
  invariant(context);
  return context;
}

export function useLayoutDispatch(): React.Dispatch<LayoutAction> {
  const context = React.useContext(LayoutDispatch);
  invariant(context);
  return context;
}

// Context provider.
type LayoutContextProviderProps = {
  children: React.ReactNode;
  defaultTopNavHeight: number;
  defaultSideNavWidth: number;
  defaultSideNavExpanded: boolean;
  defaultAsideWidth: number;
};

export function LayoutContextProvider(props: LayoutContextProviderProps) {
  const [state, dispatch] = React.useReducer((s, a) => a(s), {
    topNavHeight: props.defaultTopNavHeight,
    defaultSideNavWidth: props.defaultSideNavWidth,
    sideNavWidth: props.defaultSideNavWidth,
    sideNavExpanded: props.defaultSideNavExpanded,
    asideWidth: props.defaultAsideWidth,
  });

  // Define chains
  React.useEffect(() => {
    dispatch((prev: LayoutState) => ({ ...prev, sideNavWidth: state.sideNavExpanded ? prev.defaultSideNavWidth : 0 }));
  }, [state.sideNavExpanded]);

  return (
    <LayoutContext.Provider value={state}>
      <LayoutDispatch.Provider value={dispatch}>{props.children}</LayoutDispatch.Provider>
    </LayoutContext.Provider>
  );
}
