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

const Audio = observer(({
  isPreview,
  isPrivate,
  id,
  name,
  format,
  albumName,
  albumImage,
  singerName,
  albumId,
  singerId,
  playlistId,
  duration,
  number,
  isFavourite
}) => {
  const [focus, setFocus] = useState(false);
  const [isEditWindowVisible, setIsEditWindowVisible] = useState(false);
  const audioRef = useRef();
  const [deleteSong, deleteSongError] = useFetching(() => {
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
    setIsEditWindowVisible(true);
    const song = {
      name,
      singerName,
      albumName,
      singerId,
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

  return (
    <div
      className={style.audio}
    >
      <audio preload='none' src={!isPreview ? name + '.' + format : ''} ref={audioRef}></audio>
      <div className={[style.column, style['number-column']].join(' ')}>
        <p className={style['number-text']}>{number}</p>
      </div>
      <div className={[style.column, ['albumName-image-column']].join(' ')}>
        <img src={albumImage} alt="Album icon" className={style['albumName-image']} />
      </div>
      <div className={[style.column, style['name-column']].join(' ')}>
        <p className={style['name-text']}>{
          name.length > 25 ?
            name.slice(0, 25) + '...' :
            name
        }</p>
        <p className={style['name-singerName-text']}>{singerName}</p>
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
          <ButtonIcon 
            buttonName='favourite-song'
          />
        }
      </div>
      <div className={[style.column, style['duration-column']].join(' ')}>
        <p className={style['duration-text']}>{duration}</p>
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
      {
        isEditWindowVisible &&
        <EditSongWindow isPreview={isPreview} setVisible={setIsEditWindowVisible} />
      }
    </div>
  );
});

export default Audio;