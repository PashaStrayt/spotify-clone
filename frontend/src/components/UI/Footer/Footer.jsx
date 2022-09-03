import style from './Footer.module.scss';

const Footer = ({ className, children }) => {
  return (
    <footer className={style[className]}>
      {children}
    </footer>
  );
};

export default Footer;