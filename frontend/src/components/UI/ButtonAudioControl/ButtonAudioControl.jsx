import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useState } from 'react';
import { audioStore } from '../../../store/AudioStore';
import Button from '../Button/Button';
import { buttonsAudioControlList } from './buttonsAudioControlList'
import style from './ButtonAudioControl.module.scss';

const ButtonAudioControl = observer(({ buttonName, additionalStyle, clickHandler }) => {
  const { title, urlOfImage, urlOfActiveImage, size } = buttonsAudioControlList[buttonName];
  const [stateUrlOfImage, setStateUrlOfImage] = useState(urlOfImage);
  const [isChangeLoopActive, setIsChangeLoopActive] = useState(audioStore.currentPlaying.audio.loop);

  useEffect(() => {
    if (buttonName === 'play-pause') {
      setStateUrlOfImage(
        audioStore.currentPlaying.audio.paused ?
          urlOfImage :
          urlOfActiveImage
      );
    }
  }, [audioStore.currentPlaying.audio.paused]);
  useEffect(() => {
    if (buttonName === 'change-mute') {
      setStateUrlOfImage(
        audioStore.currentPlaying.audio.volume ?
          urlOfImage :
          urlOfActiveImage
      );
    }
  }, [audioStore.currentPlaying.audio.volume]);
  useEffect(() => {
    if (buttonName === 'change-loop') {
      setStateUrlOfImage(
        audioStore.currentPlaying.audio.loop ?
           urlOfActiveImage:
           urlOfImage
      );
    }
  }, [audioStore.currentPlaying.audio.loop]);


  return (
    <Button
      className={'audio-sontrol--' + size}
      clickHandler={clickHandler}
      title={title}
      additionalStyle={{ ...additionalStyle, opacity: isChangeLoopActive ? 1 : '' }}
    >
      <img src={stateUrlOfImage} alt="Icon" className={style.icon} />
    </Button>
  );
});

export default ButtonAudioControl;