import style from './Footer.module.scss';

const Footer = ({ className, additionalStyle, children }) => {
  return (
    <footer className={style[className]} style={additionalStyle}>
      {children}
    </footer>
  );
};

export default Footer;