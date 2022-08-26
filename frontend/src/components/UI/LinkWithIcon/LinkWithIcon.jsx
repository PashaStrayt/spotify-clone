import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { linksWithIconList } from './linksWithIconList';
import Link from '../Link/Link'

const LinkWithIcon = ({ linkName, className = 'with-icon', additionalStyle, clickHandler }) => {
  const { pathname: currentLink } = useLocation();
  const [active, setActive] = useState();
  const { path, text, urlOfImage, urlOfImageActive } = linksWithIconList[linkName];

  useEffect(() => setActive(currentLink.includes(path)), [currentLink]);

  return (
    <Link
      path={path}
      className={className}
      additionalStyle={{
        ...additionalStyle,
        opacity: active ? 1 : ''
      }}
      clickHandler={clickHandler}
    >
      <img
        src={active && urlOfImageActive ? urlOfImageActive : urlOfImage}
        alt="Link icon"
      />
      {text}
    </Link>
  );
};

export default LinkWithIcon;