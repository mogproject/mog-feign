import { mainStyles } from './styles';

type MainProps = {
  children: React.ReactNode;
};

const SideNav: React.FC<MainProps> = (props) => {
  return <nav css={mainStyles}>{props.children}</nav>;
};

export default SideNav;
