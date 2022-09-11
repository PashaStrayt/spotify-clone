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

const initialURL = 'http://localhost:3000/api/song/';

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
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef();
  const deleteSong = useFetching(async () => {
    let url;
    if (playlistId) {
      url = new URL(initialURL + 'delete-song-from-playlist');
      url.searchParams.append(isPrivate ? 'songPrivateId' : 'songId', id);
      url.searchParams.append('playlistId', playlistId);
    } else {
      url = new URL(initialURL + id);
      url.searchParams.append('isPrivate', isPrivate);
      url.searchParams.append('userId', userStore.userId);
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': 'bearer ' + userStore.token
      }
    });

    if (response.status === 200) {
      audioStore.deleteFromAvailableQueue(number - 1);
      audioStore.setCurrentPlaying({});
    }
  });
  const makeFavouriteSong = useFetching(async () => {
    const url = new URL(initialURL + 'make-favourite');
    url.searchParams.append('isPrivate', isPrivate);
    url.searchParams.append('userId', userStore.userId);
    url.searchParams.append('songId', id);

    await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'bearer ' + userStore.token
      }
    });
  });

  const editClickHandler = () => {
    uiStore.setButtonIconActive('');
    uiStore.setEditSongWindow({ isVisible: true, isPreview });
    const song = {
      id,
      name,
      singers: deepCopy(singers),
      albumName,
      albumId,
      index: number - 1,
      wasPrivate: isPrivate
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
    if (isPreview) return;

    makeFavouriteSong();
  };
  const audioClickHandler = () => {
    if (isPreview) return;
    if (audioStore.currentPlaying.audio.src.slice(-41) === fileName || audioStore.currentPlaying.audio.src.slice(-40) === fileName) {
      if (audioStore.currentPlaying.audio.paused) {
        setIsPlaying(true);
        audioStore.setCurrentPlaying({});
        audioStore.currentPlaying.audio.play();
      } else {
        setIsPlaying(false);
        audioStore.setCurrentPlaying({});
        audioStore.currentPlaying.audio.pause();
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
    if (!isPreview) {
      if (audioStore.currentPlaying.fileName === fileName) {
        if (audioStore.currentPlaying.audio.paused) {
          setIsActive(true);
          setIsPlaying(false);
        } else {
          setIsActive(true);
          setIsPlaying(true);
        }
      } else {
        setIsActive(false);
        setIsPlaying(false);
      }
    }
  }, [audioStore.currentPlaying.fileName, audioStore.currentPlaying.audio.paused]);

  return (
    <div
      className={style.audio}
      style={isActive ? { background: 'rgba(255, 255, 255, 0.1)' } : {}}
      onClick={audioClickHandler}
    >
      <audio preload='none' src={!isPreview ? '/' + fileName : ''} ref={audioRef}></audio>
      <div className={[style.column, style['number-column']].join(' ')}>
        {
          isPlaying ?
            <AudioWave /> :
            <p
              className={style['number-text']}
              style={isActive ? { color: '#65D36E' } : {}}
            >
              {number}
            </p>
        }
      </div>
      <div className={[style.column, style['album-image-column']].join(' ')}>
        <img src={'/' + albumImage} alt="Album icon" className={style['album-image']} />
      </div>
      <div className={[style.column, style['name-column']].join(' ')}>
        <p
          className={style['name-text']}
          style={isActive ? { color: '#65D36E' } : {}}
        >
          {
            name.length > uiStore.stringLimit.name ?
              name.slice(0, uiStore.stringLimit.name) + '...' :
              name
          }
        </p>
        <p className={style['name-singerName-text']}>{
          makeSingerNames(singers).length > uiStore.stringLimit.singers ?
            makeSingerNames(singers).slice(0, uiStore.stringLimit.singers) + '...' :
            makeSingerNames(singers)
            || 'Не известен'
        }</p>
      </div>
      <div className={[style.column, style['album-column']].join(' ')}>
        <p className={style['album-text']}>{
          albumName.length > uiStore.stringLimit.album ?
            albumName.slice(0, uiStore.stringLimit.album) + '...' :
            albumName
            || 'Без альбома'}</p>
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