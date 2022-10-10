import styles from './styles.module.scss';
import AudioWave from '../../../atoms/AudioWave/AudioWave';
import className from 'classnames';
import { uiStore } from '../../../../stores/UIStore';
import { AudioAPI } from '../../../../shared/AudioAPI';
import { useState, useEffect } from 'react';
import FavouriteSongButton from '../../Buttons/FavouriteSongButton';
import { userStore } from '../../../../stores/UserStore';
import { observer } from 'mobx-react-lite';
import IconButton from '../../../atoms/Buttons/IconButton/IconButton';
import Image from '../../../atoms/Image/Image';
import CutByLimitParagraph from '../../../atoms/CutByLimitParagraph/CutByLimitParagraph';
import { PROXY_URL } from './../../../../shared/workingWithFetch';

const AudioItemMarkupRow = observer(({
  isPlaying,
  isClicked,
  clickHandler,
  onEdit,
  onDelete,
  ...props
}) => {
  const [classNames, setClassNames] = useState();

  useEffect(() => {
    setClassNames({
      albumImage: className(styles.column, styles['album-image']),
      mainInfo: className(styles.column, styles['main-info']),
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
        })
      }
    });
  }, [isClicked]);

  return (
    <div
      className={classNames?.self}
      style={{padding: '10px 25px'}}
      onClick={clickHandler}
    >

      {/* Doesn't take space in markup  */}
      <audio preload='none' src={PROXY_URL + !props.isPreview ? '/' + props.fileName : ''}></audio>

      <div className={classNames?.number}>
        {
          isPlaying ?
            <AudioWave /> :
            props.number
        }
      </div>

      <Image
        type='audio'
        src={PROXY_URL + '/' + props.albumImage || 'album-image.svg'}
        alt="Album icon"
      />

      {/* Name and singers of song */}
      <div className={classNames?.mainInfo}>
        <CutByLimitParagraph className='song-name' isActive={isClicked} limit={uiStore.stringLimit.name}>
          {props.name}
        </CutByLimitParagraph>
        <CutByLimitParagraph className='singers' limit={uiStore.stringLimit.singers}>
          {AudioAPI.makeSingerNames(props.singers)}
        </CutByLimitParagraph>
      </div>

      <CutByLimitParagraph className='singers' isColumn={true} limit={uiStore.stringLimit.album}>
          {props.albumName}
        </CutByLimitParagraph>

      <p className={classNames?.format}>{props.format.toUpperCase()}</p>

      {/* Favourite song button */}
      <div className={classNames?.buttonContainer}>
        {
          !props.isPreview &&
          <FavouriteSongButton
            isClicked={props.isFavourite}
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