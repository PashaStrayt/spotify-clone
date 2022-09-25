import styles from './styles.module.scss';
import { Transition } from 'react-transition-group';
import classNames from 'classnames';

const AudioInfoPlate = ({ isOpened, name, singers, albumName, albumImage, format }) => {

  return (
    <div className={classNames(styles.wrapper, { [styles['wrapper--opened']]: isOpened })}>
      <Transition
        in={isOpened}
        timeout={400}
        mountOnEnter
        unmountOnExit
      >
        {
          state =>
            <div className={classNames(styles.container, styles[state])}>
              <img src={'/' + albumImage} className={styles.image} alt="" />
              <div className={styles.info}>
                <div className={styles.info__row}>
                  <p className={styles['info__song-name']}>{name}</p>
                  <p className={styles['info__singers-names']}>{singers}</p>
                </div>
                <div className={styles.info__row}>
                  <p className={styles['info__property-name']}>АЛЬБОМ</p>
                  <p className={styles['info__value']}>{albumName}</p>
                </div>
                <div className={styles.info__row}>
                  <p className={styles['info__property-name']}>ФОРМАТ</p>
                  <p className={styles['info__value']}>{format.toUpperCase()}</p>
                </div>
              </div>
            </div>
        }
      </Transition>
    </div>
  );
};

export default AudioInfoPlate;