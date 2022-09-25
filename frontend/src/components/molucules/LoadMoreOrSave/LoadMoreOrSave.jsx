import styles from './styles.module.scss';
import Button from './../../atoms/Buttons/Button/Button';

const LoadMoreOrSave = ({ onSave, onCancel }) => {
  return (
    <div className={styles.container}>
      <p className={styles['upload-more']}>загрузите еще</p>
      <p className={styles.or}>или</p>
      <div className={styles.buttons}>
        <Button className='green' clickHandler={onSave}>
          Готово
        </Button>
        <Button className='transparent' clickHandler={onCancel}>
          Отмена
        </Button>
      </div>
    </div>
  );
};

export default LoadMoreOrSave;