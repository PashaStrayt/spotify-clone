import { Link as RouterLink } from 'react-router-dom';
import style from './Link.module.scss';

const Link = ({ additionalStyle, path, children, clickHandler }) => {
  return (
    <RouterLink
      to={path}
      className={style.self}
      style={additionalStyle}
      onClick={clickHandler}
    >
      {children}
    </RouterLink>
  );
};

export default Link;