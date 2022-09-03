import Footer from '../UI/Footer/Footer'
import { observer } from 'mobx-react-lite';
import style from './AudioPanel.module.scss';
import { audioStore } from '../../store/AudioStore';
import ButtonFavourite from '../UI/ButtonFavourite/ButtonFavourite';
import ButtonAudioControl from '../UI/ButtonAudioControl/ButtonAudioControl';
import { useEffect } from 'react';
import { useState } from 'react';
import { makeDurationString } from '../../API/audio';
import Progress from '../UI/Progress/Progress';

const getLastPlayed = () => {
  return JSON.parse(localStorage.getItem('lastPlayed'));
}

const AudioPanel = observer(() => {
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
    }
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
          isActive={audioStore.currentPlayingisFavourite}
        />
      </div>
      <div className={style.center}>
        <div className={style['center__control--main']}>
          <ButtonAudioControl buttonName='set-previous' />
          <ButtonAudioControl
            buttonName='play-pause'
            clickHandler={playPauseClickHandler}
          />
          <ButtonAudioControl buttonName='set-next' />
        </div>
        <div className={style['center__duration-progress']}>
          <p className={style['duration-progress__time']}>
            {makeDurationString(currentTime).split(' ').join('')}
          </p>
          <Progress 
            className='audio-time-scale'
            value={0 || currentTime}
            max={duration || 100}
          />
          <p className={style['duration-progress__time']}>
            {makeDurationString(duration).split(' ').join('')}
          </p>
        </div>
      </div>
      <div className={style.right}>
        <ButtonAudioControl buttonName='change-mute' />
      </div>
    </Footer>
  );
});

export default AudioPanel;