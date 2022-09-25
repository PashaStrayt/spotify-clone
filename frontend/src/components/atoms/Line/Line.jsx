import styles from './styles.module.scss';

const Line = ({ className = 'simple' }) => {
  return (
    <hr className={styles[className]} />
  );
};

export default Line;