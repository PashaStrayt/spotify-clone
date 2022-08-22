import style from './Button.module.scss';

const Button = ({ children, className, additionalStyle, clickHandler, title, ...props }) => {
  return (
    <button
      className={style[className]}
      onClick={clickHandler}
      style={additionalStyle}
      title={title ? title : children}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;