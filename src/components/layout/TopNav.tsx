import React from 'react';
import { useLayoutState } from './LayoutContext';
import { topNavStyles } from './styles';

type TopNavProps = {
  children: React.ReactNode;
};

const TopNav: React.FC<TopNavProps> = (props) => {
  const state = useLayoutState();

  const heightStyles = React.useMemo(() => {
    return {
      height: state.topNavHeight,
    };
  }, [state.topNavHeight]);
  return <header css={[topNavStyles, heightStyles]}>{props.children}</header>;
};

export default TopNav;
