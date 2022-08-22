import { Link as LinkRouter } from 'react-router-dom';
import style from './Link.module.scss';

const Link = ({ className, additionalStyle, path, children }) => {
  return (
    <LinkRouter
      to={path}
      className={style[className]}
      style={additionalStyle}
    >
      {children}
    </LinkRouter>
  );
};

export default Link;