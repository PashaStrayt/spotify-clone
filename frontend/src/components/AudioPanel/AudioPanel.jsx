import Footer from '../UI/Footer/Footer'
import { observer } from 'mobx-react-lite';
import style from './AudioPanel.module.scss';
import { audioStore } from '../../store/AudioStore';
import ButtonFavourite from '../UI/ButtonFavourite/ButtonFavourite';
import ButtonAudioControl from '../UI/ButtonAudioControl/ButtonAudioControl';
import { useEffect } from 'react';
import { useState } from 'react';
import { makeDurationString, shuffleArray } from '../../API/audio';
import Progress from '../UI/Progress/Progress';

const getLastPlayed = () => {
  return JSON.parse(localStorage.getItem('lastPlayed'));
}

const AudioPanel = observer(() => {
  const [availableCurrentTime, setAvailableCurrentTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(audioStore.currentPlaying.audio.currentTime);
  const [duration, setDuration] = useState(audioStore.currentPlaying.audio.duration);

  useEffect(() => {
    setCurrentTime(Math.ceil(audioStore.currentPlaying.audio.currentTime));
    setDuration(Math.ceil(audioStore.currentPlaying.audio.duration || audioStore.currentPlaying.duration));
  }, [audioStore.currentPlaying.currentTime]);

  const playPauseClickHandler = () => {
    if (audioStore.currentPlaying.audio.paused) {
      audioStore.currentPlaying.audio.play();
      audioStore.setCurrentPlaying({});
    } else {
      audioStore.currentPlaying.audio.pause();
      audioStore.setCurrentPlaying({});
    }
  };
  const setPreviousClickHandler = () => {
    const previousSongIndex = audioStore.currentPlaying.index === 0 ?
      audioStore.currentQueue.queue.length - 1 :
      audioStore.currentPlaying.index - 1;

    audioStore.setNextCurrentPlaying(previousSongIndex);
    audioStore.currentPlaying.audio.play();
  };
  const setNextClickHandler = () => {
    const nextSongIndex = audioStore.currentPlaying.index === audioStore.currentQueue.queue.length - 1 ?
      0 :
      audioStore.currentPlaying.index + 1;

    if (nextSongIndex <= audioStore.currentQueue.queue.length - 1) {
      audioStore.setNextCurrentPlaying(nextSongIndex);
      audioStore.currentPlaying.audio.play();
    } else {
      audioStore.setCurrentQueue({ isEnded: true });
    }
  };
  const changeLoopClickHandler = () => {
    audioStore.currentPlaying.audio.loop = !audioStore.currentPlaying.audio.loop;
    audioStore.setCurrentPlaying({})
  };
  const shuffleQueueClickHandler = () => {
    audioStore.setCurrentQueue({ queue: shuffleArray(audioStore.currentQueue.queue) });
    setNextClickHandler();
  };
  const favouriteClickHandler = () => {
  };

  return (
    <Footer className='audio-panel'>
      <div className={style.left}>
        <div className={style['left__info']}>
          <p className={style.info__name}>
            {audioStore.currentPlaying.name}
          </p>
          <p className={style.info__singers}>
            {audioStore.currentPlaying.singers}
          </p>
        </div>
        <ButtonFavourite
          size='small'
          clickHandler={favouriteClickHandler}
          isActive={audioStore.currentPlaying.isFavourite}
        />
      </div>
      <div className={style.center}>
        <div className={style['center__control--main']}>
          <ButtonAudioControl
            buttonName='shuffle-queue'
            clickHandler={shuffleQueueClickHandler}
          />
          <ButtonAudioControl
            buttonName='set-previous'
            clickHandler={setPreviousClickHandler}
          />
          <ButtonAudioControl
            buttonName='play-pause'
            clickHandler={playPauseClickHandler}
          />
          <ButtonAudioControl
            buttonName='set-next'
            clickHandler={setNextClickHandler}
          />
          <ButtonAudioControl
            buttonName='change-loop'
            clickHandler={changeLoopClickHandler}
            additionalStyle={{ marginBottom: '-5px' }}
          />
        </div>
        <div className={style['center__duration-progress']}>
          <p className={style['duration-progress__time']}>
            {makeDurationString(currentTime).split(' ').join('')}
          </p>
          <Progress
            className='audio-time-scale'
            min={0}
            value={availableCurrentTime || currentTime}
            max={duration || 100}
            step={1}
            changeHandler={event => setAvailableCurrentTime(event.target.value)}
            mouseUpHandler={event => {
              setCurrentTime(event.target.value);
              audioStore.currentPlaying.audio.currentTime = event.target.value;
              setAvailableCurrentTime(0);
            }}
          />
          <p className={style['duration-progress__time']}>
            {makeDurationString(duration).split(' ').join('')}
          </p>
        </div>
      </div>
      <div className={style.right}>
        <ButtonAudioControl
          buttonName='change-mute'
          clickHandler={() => {
            if (audioStore.currentPlaying.audio.volume) {
              audioStore.currentPlaying.audio.volume = 0;
            } else {
              audioStore.currentPlaying.audio.volume = Number(localStorage.getItem('volume'));
            }
            audioStore.setCurrentPlaying({});
          }}
        />
        <Progress
          className='volume-scale'
          min={0}
          value={audioStore.currentPlaying.audio.volume}
          max={1}
          step={0.025}
          changeHandler={event => {
            audioStore.currentPlaying.audio.volume = event.target.value;
            audioStore.setCurrentPlaying({});
            localStorage.setItem('volume', event.target.value);
          }}
        />
      </div>
    </Footer>
  );
});

export default AudioPanel;