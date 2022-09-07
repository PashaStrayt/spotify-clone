import style from './Input.module.scss';

const Input = ({ className, additionalStyle, type, changeHandler, reference, ...props }) => {
  return (
    <input
      className={style[className]}
      style={additionalStyle}
      type={type || 'text'}
      onChange={changeHandler}
      ref={reference}
      {...props}
    />
  );
};

export default Input;