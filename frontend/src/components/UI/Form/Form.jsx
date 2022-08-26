import style from './Form.module.scss';

const Form = ({ className, children, ...props }) => {
  return (
    <form className={style[className]} {...props}>{children}</form>
  );
};

export default Form;