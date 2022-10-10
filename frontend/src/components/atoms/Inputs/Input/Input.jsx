import styles from './styles.module.scss';

const Input = ({
  className = 'simple',
  additionalStyle,
  type = 'text',
  reference,
  children,
  changeHandler,
  keyDownHandler,
  ...props
}) => {
  return (
    <input
      className={styles[className]}
      style={additionalStyle}
      type={type}
      onChange={changeHandler}
      onKeyDown={keyDownHandler}
      ref={reference}
      {...props}
    >
      {children}
    </input>
  );
};

export default Input;