import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { linksWithIconList } from './linksWithIconList';
import Link from '../Link/Link'

const LinkWithIcon = ({ linkName, additionalStyle }) => {
  const { pathname: currentLink } = useLocation();
  const [active, setActive] = useState();
  const { path, text, urlOfImage, urlOfImageActive } = linksWithIconList[linkName];

  useEffect(() => setActive(currentLink.includes(path)), [currentLink]);

  return (
    <Link
      path={path}
      className='with-icon'
      additionalStyle={{ ...additionalStyle, opacity: active ? 1 : '' }}
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