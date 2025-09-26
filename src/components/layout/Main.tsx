
type MainProps = {
  children: React.ReactNode;
};

const Main: React.FC<MainProps> = (props) => {
  return <div>{props.children}</div>;
};

export default Main;
