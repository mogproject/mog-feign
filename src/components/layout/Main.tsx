import { mainStyles } from './styles';

type MainProps = {
  children: React.ReactNode;
};

const Main: React.FC<MainProps> = (props) => {
  return <div css={mainStyles}>{props.children}</div>;
};

export default Main;
