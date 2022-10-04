import { observer } from 'mobx-react-lite';
import styles from './styles.module.scss';
import CutByLimitParagraph from '../../../atoms/CutByLimitParagraph/CutByLimitParagraph';
import { AudioAPI } from '../../../../shared/AudioAPI';
import FavouriteSongButton from '../../Buttons/FavouriteSongButton';
import IconButton from '../../../atoms/Buttons/IconButton/IconButton';
import InputRange from '../../../atoms/Inputs/InputRange/InputRange';
import { uiStore } from './../../../../stores/UIStore';
import { audioStore } from './../../../../stores/AudioStore';
import { userStore } from './../../../../stores/UserStore';

const AudioPanelMarkup = observer(({
  songData,
  onShuffleQueue,
  onPlayPause,
  onPrevious,
  onNext,
  onLoop,
  onRewind,
  onEndRewind,
  onChangeMute,
  onControlVolume,
  onShowAudioInfoPlate
}) => {
  return (
    <div className={styles.container}>

      <div className={styles.left}>

        <div className={styles['left__info']}>
          <CutByLimitParagraph className='song-name' isActive={true} limit={uiStore.stringLimit.name + 5}>
            {songData.name}
          </CutByLimitParagraph>
          <CutByLimitParagraph className='singers' limit={uiStore.stringLimit.singers}>
            {AudioAPI.makeSingerNames(songData.singers) || 'Не известен'}
          </CutByLimitParagraph>
        </div>

        <FavouriteSongButton
          songData={{
            isPreview: songData.isPreview,
            isPrivate: songData.isPrivate,
            userId: userStore.userId,
            songId: songData.id
          }}
          isClicked={songData.isFavourite}
        />
      </div>

      <div className={styles.center}>

        <div className={styles['center__control--main']}>
          <IconButton
            name='shuffle-queue'
            clickHandler={onShuffleQueue}
          />
          <IconButton
            name='set-previous'
            clickHandler={onPrevious}
          />
          <IconButton
            name='play-pause'
            isApplyingHover={false}
            isClicked={!audioStore.currentPlaying.audio.paused}
            clickHandler={onPlayPause}
          />
          <IconButton
            name='set-next'
            clickHandler={onNext}
          />
          <IconButton
            name='change-loop'
            additionalStyle={{ marginBottom: '-5px' }}
            clickHandler={onLoop}
          />
        </div>

        <div className={styles['center__duration-progress']}>

          <p className={styles['duration-progress__time']}>
            {AudioAPI.formatTime(songData.currentTime, { makeIndent: false })}
          </p>

          <InputRange
            type='current-time'
            min={0}
            value={songData.currentTime}
            max={songData.duration || 100}
            step={1}
            changeHandler={onRewind}
            mouseUpHandler={onEndRewind}
          />

          <p className={styles['duration-progress__time']}>
            {AudioAPI.formatTime(songData.duration, { makeIndent: false })}
          </p>

        </div>

      </div>

      <div className={styles.right}>
        <IconButton
          name='change-mute'
          clickHandler={onChangeMute}
        />

        <InputRange
          type='volume'
          min={0}
          value={songData.volume}
          max={1}
          step={0.025}
          changeHandler={onControlVolume}
        />

        <IconButton
          name='visible-song-info-plate'
          clickHandler={onShowAudioInfoPlate}
        />
      </div>
    </div>
  );
});

export default AudioPanelMarkup;