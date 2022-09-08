import EditSongWindow from '../EditContentWindow/EditSongWindow'
import { useState } from 'react';
import { useRef } from 'react';
import { useFetching } from '../../hooks/useFetching';
import { uiStore } from '../../store/UIStore';
import { userStore } from '../../store/UserStore';
import { uploadStore } from "../../store/UploadStore";
import ButtonIcon from '../UI/ButtonIcon/ButtonIcon';
import style from './Audio.module.scss';
import { observer } from 'mobx-react-lite';
import { deepCopy } from '../../API/files';
import { makeDurationString, makeSingerNames } from '../../API/audio';
import ButtonFavourite from '../UI/ButtonFavourite/ButtonFavourite';
import { audioStore } from '../../store/AudioStore';
import { useEffect } from 'react';
import AudioWave from '../UI/AudioWave/AudioWave';

const Audio = observer(({
  isPreview,
  isPrivate,
  id,
  name,
  format,
  albumName,
  albumImage = 'album-image.svg',
  singers,
  albumId,
  playlistId,
  duration,
  fileName,
  number,
  isFavourite = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef();
  const deleteSong = useFetching(() => {
    const initialURL = 'http://localhost:3000/api/';
    let url;
    if (playlistId) {
      url = new URL(initialURL + 'delete-song-from-playlist');
      url.searchParams.append(isPrivate ? 'songPrivateId' : 'songId', id);
      url.searchParams.append('playlistId', playlistId);
    } else {
      url = new URL(initialURL + id);
      url.searchParams.append('isPrivate', isPrivate);
    }

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': 'bearer ' + userStore.token
      }
    })
  });

  const editClickHandler = () => {
    uiStore.setButtonIconActive('');
    uiStore.setEditSongWindow({ isVisible: true, isPreview });
    const song = {
      name,
      singers: deepCopy(singers),
      albumName,
      albumId,
      index: number - 1
    };
    uiStore.setCurrentEditingSong(song);
  };
  const deleteClickHandler = () => {
    if (isPreview) {
      uploadStore.deleteFile(number - 1);
    } else {
      deleteSong();
    }
    uiStore.setButtonIconActive('');
  };
  const favouriteClickHandler = () => {
    uiStore.setErrorMessage('На этом пока что все!');
  };
  const audioClickHandler = () => {
    if (isPreview) return;
    if (audioStore.currentPlaying.audio.src.slice(22) === fileName) {
      if (audioStore.currentPlaying.audio.paused) {
        setIsPlaying(true);
        audioStore.setCurrentPlaying({});
        audioStore.currentPlaying.audio.play();
      } else {
        audioStore.currentPlaying.audio.pause();
        setIsPlaying(false);
      }
    } else {
      audioStore.setCurrentQueue(deepCopy(audioStore.availableQueue));
      audioStore.setCurrentPlaying({
        name,
        singers,
        albumName,
        fileName,
        format,
        albumImage,
        duration,
        isFavourite,
        index: number - 1
      });
      audioStore.currentPlaying.audio.play();
    }
  };

  useEffect(() => {
    setIsPlaying(
      audioStore.currentPlaying.fileName === fileName &&
      !audioStore.currentPlaying.audio.paused &&
      !isPreview
    );
  }, [audioStore.currentPlaying.fileName, audioStore.currentPlaying.audio.paused]);

  return (
    <div
      className={style.audio}
      style={isPlaying ? { background: 'rgba(255, 255, 255, 0.1)' } : {}}
      onClick={audioClickHandler}
    >
      <audio preload='none' src={!isPreview ? '/' + fileName : ''} ref={audioRef}></audio>
      <div className={[style.column, style['number-column']].join(' ')}>
        {
          isPlaying ?
            <AudioWave /> :
            <p className={style['number-text']}>{number}</p>
        }
      </div>
      <div className={[style.column, ['albumName-image-column']].join(' ')}>
        <img src={'/' + albumImage} alt="Album icon" className={style['albumName-image']} />
      </div>
      <div className={[style.column, style['name-column']].join(' ')}>
        <p className={style['name-text']}>{
          name.length > 25 ?
            name.slice(0, 25) + '...' :
            name
        }</p>
        <p className={style['name-singerName-text']}>{makeSingerNames(singers)}</p>
      </div>
      <div className={[style.column, style['album-column']].join(' ')}>
        <p className={style['album-text']}>{albumName}</p>
      </div>
      <div className={[style.column, style['format-column']].join(' ')}>
        <p className={style['format-text']}>{format}</p>
      </div>
      <div className={[style.column, style['button-column']].join(' ')}>
        {
          !isPreview &&
          <ButtonFavourite
            size='small'
            clickHandler={favouriteClickHandler}
            isActive={isFavourite}
          />
        }
      </div>
      <div className={[style.column, style['duration-column']].join(' ')}>
        <p className={style['duration-text']}>{Number.isInteger(duration) ? makeDurationString(duration) : '—'}</p>
      </div>
      <div className={[style.column, style['button-column']].join(' ')}>
        <ButtonIcon
          buttonName='edit-song'
          clickHandler={editClickHandler}
        />
      </div>
      <div className={[style.column, style['button-column']].join(' ')}>
        <ButtonIcon
          buttonName='delete-song'
          clickHandler={deleteClickHandler}
        />
      </div>
    </div>
  );
});

export default Audio;