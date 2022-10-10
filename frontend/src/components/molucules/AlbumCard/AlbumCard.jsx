import { Link as RouterLink } from 'react-router-dom';
import Image from './../../atoms/Image/Image';
import styles from './styles.module.scss';
import { PROXY_URL } from './../../../shared/workingWithFetch';

const AlbumCard = ({ id, name, singers, date, imageFileName, songsAmount }) => {
  return (
    <RouterLink className={styles.self} to={'/album/' + id}>
      <Image
        type='album'
        size='small'
        src={PROXY_URL + '/' + imageFileName}
        alt='Album image'
      />
      <div className={styles.info}>
        <p className={styles.info__date}>{date}, {songsAmount} songs</p>
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