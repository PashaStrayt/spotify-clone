import { Link as RouterLink } from 'react-router-dom';
import style from './Link.module.scss';

const Link = ({ className, additionalStyle, path, children, clickHandler }) => {
  return (
    <RouterLink
      className={style[className]}
      style={additionalStyle}
      to={path}
      onClick={clickHandler}
    >
      {children}
    </RouterLink>
  );
};

export default Link;