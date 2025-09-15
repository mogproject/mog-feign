import React from 'react';
import { useLayoutDispatch } from './LayoutContext';
import { topNavStyles } from './styles';

type TopNavProps = {
  children: React.ReactNode;
};

const TopNav: React.FC<TopNavProps> = (props) => {
  const topNavRef = React.useRef<HTMLElement>(null);
  const dispatch = useLayoutDispatch();

  React.useEffect(() => {
    dispatch((prev) => ({ ...prev, topNavRef: topNavRef }));
  }, [topNavRef]);

  return (
    <header ref={topNavRef} css={topNavStyles}>
      {props.children}
    </header>
  );
};

export default TopNav;
