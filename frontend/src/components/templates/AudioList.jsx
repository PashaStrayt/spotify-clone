import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import AudioListMarkupRow from '../molucules/Markups/AudioRows/AudioListMarkupRow';
import Line from './../atoms/Line/Line';
import { audioStore } from './../../stores/AudioStore';
import { uiStore } from './../../stores/UIStore';
import AudioItem from './../organisms/AudioItem';
import { useEffect } from 'react';
import { uploadStore } from './../../stores/UploadStore';

const AudioList = observer(({ currentAlbumId, isPreview, audios, playlistId }) => {
  const observableRef = useRef();

  useIntersectionObserver(
    observableRef,
    audioStore.availableQueue.page < audioStore.availableQueue.totalPages && !isPreview,
    uiStore.isLoading,
    () => {
      audioStore.setAvailableQueue({ page: audioStore.availableQueue.page + 1 });
    }
  );

  if (!audios?.length) {
    return null;
  }

  return (
    <div style={{ display: 'flex', flexFlow: 'column nowrap', gap: '6px' }}>
      <AudioListMarkupRow />
      <Line />
      {
        audios.map((audio, index) =>
          audio?.albumId && currentAlbumId && parseInt(audio?.albumId) !== parseInt(currentAlbumId) ?
            '' :
            <AudioItem
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
      <div ref={observableRef} className='emty'></div>
    </div>
  );
});

export default AudioList;