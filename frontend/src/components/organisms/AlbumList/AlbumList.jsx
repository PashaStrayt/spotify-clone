import AlbumCard from '../../molucules/AlbumCard/AlbumCard';
import styles from './styles.module.scss';
import { AudioAPI } from './../../../shared/AudioAPI';
import { useIntersectionObserver } from './../../../hooks/useIntersectionObserver';
import { useRef } from 'react';
import { uiStore } from './../../../stores/UIStore';
import { audioStore } from './../../../stores/AudioStore';
import { observer } from 'mobx-react-lite';

const AlbumList = observer(({ isExpanded }) => {
  const observableRef = useRef();

  useIntersectionObserver(
    observableRef,
    audioStore.albums.page < audioStore.albums.totalPages && isExpanded,
    uiStore.isLoading,
    () => {
      audioStore.setAlbums({ page: audioStore.albums.page + 1 });
    }
  );

  return (
    <div className={styles.self}>
      {
        audioStore.albums.list.map(({ id, name, singers, date, imageFileName }) =>
          <AlbumCard
            id={id}
            name={name}
            singers={AudioAPI.makeSingerNames(singers)}
            date={date}
            imageFileName={imageFileName}
            key={'album-card-' + id}
          />
        )
      }
      <div ref={observableRef} className='emty'></div>
    </div>
  );
});

export default AlbumList;