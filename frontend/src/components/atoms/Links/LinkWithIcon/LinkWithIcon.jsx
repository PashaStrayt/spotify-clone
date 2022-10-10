import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { list } from './list';
import { Link as RouterLink } from 'react-router-dom';
import className from 'classnames';
import styles from './styles.module.scss';
import { PROXY_URL } from './../../../../shared/workingWithFetch';

const LinkWithIcon = ({ isBackground = false, name, additionalStyle, clickHandler }) => {
  const location = useLocation();
  const [isClicked, setIsClicked] = useState();
  const { path, text, imageUrl, activeImageUrl } = list[name];

  useEffect(() => setIsClicked(location.pathname.includes(path)), [location.pathname]);

  return (
    <RouterLink
      className={className(styles.self, {
        [styles['self--isClicked']]: isClicked,
        [styles['self--with-background']]: isBackground
      })}
      style={additionalStyle}
      to={path}
      onClick={clickHandler}
    >
      <img
        className={styles.icon}
        src={PROXY_URL + (isClicked && activeImageUrl ? activeImageUrl : imageUrl)}
        alt="Link icon"
      />
      {text}
    </RouterLink>
  );
};

export default LinkWithIcon;