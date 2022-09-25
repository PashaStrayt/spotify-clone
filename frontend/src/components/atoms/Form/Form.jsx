import styles from './styles.module.scss';

const Form = ({ type, children, ...props }) => {
  return (
    <form className={styles[type]} {...props}>{children}</form>
  );
};

export default Form;