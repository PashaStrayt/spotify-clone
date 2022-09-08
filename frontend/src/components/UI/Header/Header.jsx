import { useState } from 'react';
import { useEffect } from 'react';
import style from './Header.module.scss';

const Header = ({ children, className, additionalStyle }) => {
  const [header, setHeader] = useState();

  const makeHeader = () => {
    switch (className) {
      case 'primary':
        return (
          <h1
            className={style.primary}
            style={additionalStyle}
          >
            {children}
          </h1>
        );
      case 'secondary':
        return (
          <h2
            className={style.secondary}
            style={additionalStyle}
          >
            {children}
          </h2>
        );
      default:
        return;
    }
  };

  useEffect(() => {
    setHeader(makeHeader());
  }, [children, className, additionalStyle])

  return header;
};
export default Header;