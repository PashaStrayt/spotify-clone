import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { audioStore } from '../../store/AudioStore';
import { uiStore } from '../../store/UIStore';
import Audio from '../Audio/Audio';
import style from './AudioList.module.scss';

const AudioList = observer(({ currentAlbumId, isPreview, audios, playlistId }) => {
  const observableRef = useRef();
  const audioListRef = useRef();

  useIntersectionObserver(
    observableRef,
    audioStore.availableQueue.page < audioStore.availableQueue.totalPages && !isPreview,
    uiStore.isLoading,
    () => {
      audioStore.setAvailableQueue({ page: audioStore.availableQueue.page + 1 });
    }
  );

  return (
    <div className={style['audio-list']} ref={audioListRef}>
      <div className={style['header-table']}>
        <div className={[style.column, style['number-column']].join(' ')}>
          <p className={style.text}>#</p>
        </div>
        <div className={[style.column, style['name-column']].join(' ')}>
          <p className={style.text}>НАЗВАНИЕ</p>
        </div>
        <div className={style.column}>
          <p className={style.text}>АЛЬБОМ</p>
        </div>
        <div className={[style.column, style['format-column']].join(' ')}>
          <p className={style.text}>формат</p>
        </div>
        <div className={[style.column, style['duration-column']].join(' ')}>
          <img
            src="/duration-image.svg"
            alt="Duration icon"
            className={style['icon-image']}
          />
        </div>
        <div className={style['empty-column']}></div>
      </div>
      <hr className={style.line} />
      {
        audios.map((audio, index) =>
          audio?.albumId && currentAlbumId && parseInt(audio?.albumId) !== parseInt(currentAlbumId) ?
            '' :
            <Audio
              isPreview={isPreview}
              isPrivate={audio?.isPrivate}
              id={audio?.id}
              name={audio.name}
              format={audio?.format}
              albumName={audio?.albumName}
              albumImage={audio?.albumImage}
              singers={audio?.singers}
              albumId={audio?.albumId}
              playlistId={playlistId}
              duration={audio?.duration}
              fileName={audio?.fileName}
              number={index + 1}
              isFavourite={audio?.isFavourite}
              allSongInfo={{ ...audio, index }}
              key={audio.name}
            />
        )
      }
      <div ref={observableRef} className={style.observer}></div>
    </div>
  );
})
export default AudioList;