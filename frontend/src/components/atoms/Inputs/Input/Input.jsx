import styles from './styles.module.scss';

const Input = ({
  className = 'simple',
  additionalStyle,
  type = 'text',
  reference,
  changeHandler,
  ...props
}) => {
  return (
    <input
      className={styles[className]}
      style={additionalStyle}
      type={type}
      onChange={changeHandler}
      ref={reference}
      {...props}
    />
  );
};

export default Input;