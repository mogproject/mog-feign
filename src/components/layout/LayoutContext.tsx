import React from 'react';
import invariant from 'tiny-invariant';

type LayoutState = {
  windowWidth: number;

  /** Height of the top nav section. */
  topNavHeight: number;

  /** Default width of the side nav section. */
  defaultSideNavWidth: number;

  /** Width of the side nav section. */
  sideNavWidth: number;

  /** True if the side nav is shown. */
  showSideNav: boolean;

  /** The side nav is expanded when true, and collapsed when false. */
  sideNavExpanded: boolean;

  /** Width of the aside section. */
  asideWidth: number;

  /** True if the aside section is shown. */
  showAside: boolean;

  /** Width of the main section. */
  mainWidth: number;
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

function getMainWidth(windowWidth: number, sideNavWidth: number, asideWidth: number): number {
  const sideWidth = windowWidth < 1280 ? 0 : sideNavWidth + asideWidth;
  return Math.min(1200, windowWidth - sideWidth);
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
  const initialWindowWidth = document.documentElement.clientWidth;
  // console.log(window.innerWidth, initialWindowWidth);

  const [state, dispatch] = React.useReducer((s, a) => a(s), {
    topNavHeight: props.defaultTopNavHeight,
    defaultSideNavWidth: props.defaultSideNavWidth,
    sideNavWidth: props.defaultSideNavExpanded ? props.defaultSideNavWidth : 0,
    sideNavExpanded: props.defaultSideNavExpanded,
    asideWidth: props.defaultAsideWidth,
    windowWidth: initialWindowWidth,
    showSideNav: initialWindowWidth >= 1280,
    showAside: initialWindowWidth >= 1280,
    mainWidth: getMainWidth(initialWindowWidth, props.defaultSideNavExpanded ? props.defaultSideNavWidth : 0, props.defaultAsideWidth),
  });

  // Monitor window width
  React.useEffect(() => {
    const observer = new ResizeObserver(() => {
      const windowWidth = document.documentElement.clientWidth;
      if (windowWidth === window.innerWidth) return;

      dispatch((prev: LayoutState) => {
        return {
          ...prev,
          windowWidth: windowWidth,
          showSideNav: windowWidth >= 1280,
          showAside: windowWidth >= 1280,
          mainWidth: getMainWidth(windowWidth, prev.sideNavWidth, prev.asideWidth),
        };
      });
    });

    observer.observe(document.documentElement);

    return () => observer.disconnect();
  }, []);

  // Define chains
  React.useEffect(() => {
    dispatch((prev: LayoutState) => {
      const sideNavWidth = state.sideNavExpanded ? prev.defaultSideNavWidth : 0;
      return { ...prev, sideNavWidth: sideNavWidth, mainWidth: getMainWidth(prev.windowWidth, sideNavWidth, prev.asideWidth) };
    });
  }, [state.sideNavExpanded]);

  return (
    <LayoutContext.Provider value={state}>
      <LayoutDispatch.Provider value={dispatch}>{props.children}</LayoutDispatch.Provider>
    </LayoutContext.Provider>
  );
}
