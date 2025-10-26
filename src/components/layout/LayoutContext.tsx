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

  /** True if the aside section is maximized. */
  showAside: boolean;

  /** True if the aside section overlaps the main section. */
  overlayAside: boolean;

  /** Width of the main section. */
  mainWidth: number;

  /** Left margin of the main section. */
  mainMargin: number;
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

function adjustState(state: LayoutState) {
  // Overlay aside when window is small or aside is minimized.
  const overlayAside = state.windowWidth < 1280 || !state.showAside;

  // Compute the main width.
  const scrollBarBuffer = 15;
  let avail = state.windowWidth - scrollBarBuffer;
  if (state.showSideNav) avail -= state.sideNavWidth;
  if (!overlayAside) avail -= state.asideWidth;

  let mainMargin = 0;
  let mainWidth = 1200;
  if (avail <= mainWidth) {
    mainWidth = avail;
  } else {
    mainMargin = (avail - mainWidth) / 2;
  }

  return {
    ...state,
    overlayAside: overlayAside,
    mainWidth: mainWidth,
    mainMargin: mainMargin,
  };
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

  const [state, dispatch] = React.useReducer(
    (s, a) => a(s),
    adjustState({
      topNavHeight: props.defaultTopNavHeight,
      defaultSideNavWidth: props.defaultSideNavWidth,
      sideNavWidth: props.defaultSideNavExpanded ? props.defaultSideNavWidth : 0,
      sideNavExpanded: props.defaultSideNavExpanded,
      asideWidth: props.defaultAsideWidth,
      windowWidth: initialWindowWidth,
      showSideNav: initialWindowWidth >= 1280,
      showAside: initialWindowWidth >= 1280,
      overlayAside: false, // may be updated
      mainWidth: 0, // will be updated
      mainMargin: 0, // will be updated
    })
  );

  // Monitor window width
  React.useEffect(() => {
    let prevWidth = initialWindowWidth;
    const observer = new ResizeObserver(() => {
      const windowWidth = document.documentElement.clientWidth;
      if (prevWidth === windowWidth) return;
      prevWidth = windowWidth;

      dispatch((prev: LayoutState) => {
        return adjustState({
          ...prev,
          windowWidth: windowWidth,
          showSideNav: windowWidth >= 1280,
        });
      });
    });

    observer.observe(document.documentElement);

    return () => observer.disconnect();
  }, []);

  // Define chains
  React.useEffect(() => {
    dispatch((prev: LayoutState) => {
      const sideNavWidth = state.sideNavExpanded ? prev.defaultSideNavWidth : 0;
      return adjustState({
        ...prev,
        sideNavWidth: sideNavWidth,
      });
    });
  }, [state.sideNavExpanded]);

  React.useEffect(() => {
    dispatch((prev: LayoutState) => adjustState(prev));
  }, [state.showAside]);

  return (
    <LayoutContext.Provider value={state}>
      <LayoutDispatch.Provider value={dispatch}>{props.children}</LayoutDispatch.Provider>
    </LayoutContext.Provider>
  );
}
