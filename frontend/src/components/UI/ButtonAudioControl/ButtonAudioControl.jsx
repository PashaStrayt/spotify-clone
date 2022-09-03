import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useState } from 'react';
import { audioStore } from '../../../store/AudioStore';
import Button from '../Button/Button';
import { buttonsAudioControlList } from './buttonsAudioControlList'
import style from './ButtonAudioControl.module.scss';

const ButtonAudioControl = observer(({ buttonName, clickHandler }) => {
  const { title, urlOfImage, urlOfActiveImage, size } = buttonsAudioControlList[buttonName];
  const [stateUrlOfImage, setStateUrlOfImage] = useState(urlOfImage);

  useEffect(() => {
    if (buttonName === 'play-pause') {
      setStateUrlOfImage(
        audioStore.currentPlaying.audio.paused ?
          urlOfImage :
          urlOfActiveImage
      );
    }
  }, [audioStore.currentPlaying.audio.paused]);

  return (
    <Button
      className={'audio-sontrol--' + size}
      clickHandler={clickHandler}
      title={title}
    >
      <img src={stateUrlOfImage} alt="Icon" className={style.icon} />
    </Button>
  );
});

export default ButtonAudioControl;