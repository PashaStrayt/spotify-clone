import { observer } from 'mobx-react-lite';
import { audioStore } from '../../../store/AudioStore';
import style from './SongInfoPlate.module.scss';

const SongInfoPlate = observer(() => {

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <img src={audioStore.currentPlaying.albumImage} className={style.image} alt="" />
        <div className={style.info}>
          <div className={style.info__row}>
            <p className={style['info__song-name']}>{audioStore.currentPlaying.name}</p>
            <p className={style['info__singers-names']}>{audioStore.currentPlaying.singers}</p>
          </div>
          <div className={style.info__row}>
            <p className={style['info__property-name']}>АЛЬБОМ</p>
            <p className={style['info__value']}>{audioStore.currentPlaying.albumName}</p>
          </div>
          <div className={style.info__row}>
            <p className={style['info__property-name']}>ФОРМАТ</p>
            <p className={style['info__value']}>{audioStore.currentPlaying.format.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SongInfoPlate;