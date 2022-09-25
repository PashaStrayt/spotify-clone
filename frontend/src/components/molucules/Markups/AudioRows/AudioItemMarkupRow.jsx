import styles from './styles.module.scss';
import AudioWave from '../../../atoms/AudioWave/AudioWave';
import className from 'classnames';
import { uiStore } from '../../../../stores/UIStore';
import { AudioAPI } from '../../../../shared/AudioAPI';
import { useState, useEffect } from 'react';
import FavouriteSongButton from '../../FavouriteSongButton/FavouriteSongButton';
import { userStore } from '../../../../stores/UserStore';
import { observer } from 'mobx-react-lite';
import IconButton from '../../../atoms/Buttons/IconButton/IconButton';

const AudioItemMarkupRow = observer(({
  isPlaying,
  isClicked,
  clickHandler,
  onEdit,
  onDelete,
  ...props
}) => {
  const [classNames, setClassNames] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    setClassNames({
      singers: styles['main-info__singers'],
      albumName: className(styles.column, styles['album-name']),
      format: className(styles.column, styles.format),
      buttonContainer: className(styles.column, styles['button-container']),
      duration: className(styles.column, styles.duration)
    });
  }, []);
  useEffect(() => {
    setClassNames(prev => {
      return {
        ...prev,
        self: className(styles.container, styles['container--audio-item'], {
          [styles['container--audio-item--active']]: isClicked
        }),
        number: className(styles.column, styles.number, {
          [styles['number--clicked']]: isClicked
        }),
        albumImage: className(styles.column, styles['album-image']),
        mainInfo: className(styles.column, styles['main-info']),
        name: className(styles['main-info__name'], {
          [styles['main-info__name--clicked']]: isClicked
        })
      }
    });
  }, [isClicked]);

  useEffect(() => {
    const { name, albumName } = props;
    const singers = AudioAPI.makeSingerNames(props.singers);
    const limit = uiStore.stringLimit;

    setData({
      name: name.length > limit.name ?
        name.slice(0, limit.name) + '...' :
        name,

      singers: singers.length > limit.singers ?
        singers.slice(0, limit.singers) + '...' :
        singers ||
        'Не известен',

      albumName: albumName.length > limit.album ?
        albumName.slice(0, limit.album) + '...' :
        albumName ||
        'Без альбома'
    });
  }, [props.name, props.albumName, props.singers, uiStore.stringLimit]);

  return (
    <div
      className={classNames?.self}
      onClick={clickHandler}
    >

      {/* Doesn't take space in markup  */}
      <audio preload='none' src={!props.isPreview ? '/' + props.fileName : ''}></audio>

      <div className={classNames?.number}>
        {
          isPlaying ?
            <AudioWave /> :
            props.number
        }
      </div>

      <img
        className={classNames?.albumImage}
        src={'/' + props.albumImage || 'album-image.svg'}
        alt="Album icon"
      />

      {/* Name and singers of song */}
      <div className={classNames?.mainInfo}>
        <p className={classNames?.name}>{data?.name}</p>
        <p className={classNames?.singers}>{data?.singers}</p>
      </div>

      <p className={classNames?.albumName}>{data?.albumName}</p>

      <p className={classNames?.format}>{props.format.toUpperCase()}</p>

      {/* Favourite song button */}
      <div className={classNames?.buttonContainer}>
        {
          !props.isPreview &&
          <FavouriteSongButton
            initialIsClicked={props.isFavourite}
            songData={{
              isPreview: props.isPreview,
              isPrivate: props.isPrivate,
              userId: userStore.userId,
              songId: props.id
            }}
          />
        }
      </div>

      <time className={classNames?.duration}>
        {
          Number.isInteger(props.duration) ?
            AudioAPI.formatTime(props.duration, { makeIndent: true }) :
            '—'
        }
      </time>

      {/* Edit song button */}
      <div className={classNames?.buttonContainer}>
        {
          <IconButton
            name='edit-song'
            clickHandler={onEdit}
          />
        }
      </div>

      {/* Delete song button */}
      <div className={classNames?.buttonContainer}>
        {
          <IconButton
            name='delete-song'
            clickHandler={onDelete}
          />
        }
      </div>
    </div>
  );
});

export default AudioItemMarkupRow;