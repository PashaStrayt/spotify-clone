import styles from './styles.module.scss';

const Span = ({ color, children }) => {
  return (
    <span className={styles[color]}>{children}</span>
  );
};

export default Span;