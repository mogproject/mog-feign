import React from 'react';
import { css } from '@emotion/react';

const mainStyles = css({
  flex: 1,
});

type MainProps = {
  children: React.ReactNode;
};

const Main: React.FC<MainProps> = (props) => {
  return <div css={mainStyles}>{props.children}</div>;
};

export default Main;
