import { Link as RouterLink } from 'react-router-dom';
import Image from './../../atoms/Image/Image';
import styles from './styles.module.scss';

const AlbumCard = ({ id, name, singers, date, imageFileName }) => {
  return (
    <RouterLink className={styles.self} to={'/album/' + id}>
      <Image
        type='album'
        size='small'
        src={'/' + imageFileName}
        alt='Album image'
      />
      <div className={styles.info}>
        <p className={styles.info__date}>{date}</p>
        <p className={styles.info__name}>{name}</p>
        <p className={styles.info__singers}>{
          singers.length > 30 ?
            singers.slice(0, 30) + '...' :
            singers
        }</p>
        
      </div>
    </RouterLink>
  );
};

export default AlbumCard;