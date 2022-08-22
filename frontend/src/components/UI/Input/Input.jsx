import style from './Input.module.scss';

const Input = ({ className, type, changeHandler, ...props }) => {
  return (
    <input
      className={style[className]}
      type={type || 'text'}
      onChange={changeHandler}
      {...props}
    />
  );
};

export default Input;