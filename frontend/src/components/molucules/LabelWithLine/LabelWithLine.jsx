import styles from './styles.module.scss';
import Line from './../../atoms/Line/Line';

const LabelWithLine = ({ children }) => {
  return (
    <label className={styles.container}>
      <p className={styles.text}>{children}</p>
      <Line />
    </label>
  );
};

export default LabelWithLine;