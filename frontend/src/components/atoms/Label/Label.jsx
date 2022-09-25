import styles from './styles.module.scss';

const Label = ({ type, children }) => {
  return (
    <label className={styles[type]}>{children}</label>
  );
};

export default Label;