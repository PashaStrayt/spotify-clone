import style from './Input.module.scss';

const Input = ({ className, type, changeHandler, reference, ...props }) => {
  return (
    <input
      className={style[className]}
      type={type || 'text'}
      onChange={changeHandler}
      ref={reference}
      {...props}
    />
  );
};

export default Input;