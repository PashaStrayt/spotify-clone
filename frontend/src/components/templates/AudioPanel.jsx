import { audioStore } from '../../stores/AudioStore';
import AudioPanelMarkup from '../molucules/Markups/AudioPanel/AudioPanelMarkup';
import { shuffleArray } from '../../shared/workingWithTypes';
import { uiStore } from '../../stores/UIStore';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

const AudioPanel = observer(() => {
  const [availableCurrentTime, setAvailableCurrentTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(audioStore.currentPlaying.audio.currentTime);
  const [duration, setDuration] = useState(audioStore.currentPlaying.audio.duration);

  useEffect(() => {
    setCurrentTime(Math.ceil(audioStore.currentPlaying.audio.currentTime));
    setDuration(Math.ceil(audioStore.currentPlaying.audio.duration || audioStore.currentPlaying.duration));
  }, [audioStore.currentPlaying.currentTime]);

  const onPlayPause = () => {
    if (audioStore.currentPlaying.audio.paused) {
      audioStore.currentPlaying.audio.play();
      audioStore.setCurrentPlaying({});
    } else {
      audioStore.currentPlaying.audio.pause();
      audioStore.setCurrentPlaying({});
    }
  };
  const onPrevious = () => {
    const previousSongIndex = audioStore.currentPlaying.index === 0 ?
      audioStore.currentQueue.queue.length - 1 :
      audioStore.currentPlaying.index - 1;

    audioStore.setNextCurrentPlaying(previousSongIndex);
    audioStore.currentPlaying.audio.play();
  };
  const onNext = () => {
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
  const onLoop = () => {
    audioStore.currentPlaying.audio.loop = !audioStore.currentPlaying.audio.loop;
    audioStore.setCurrentPlaying({})
  };
  const onShuffleQueue = () => {
    audioStore.setCurrentQueue({ queue: shuffleArray(audioStore.currentQueue.queue) });
  };
  const onRewind = event => {
    if (event.target.value <= 0) {
      return setAvailableCurrentTime(0.001);
    }
    setAvailableCurrentTime(Math.floor(event.target.value));
  };
  const onEndRewind = event => {
    setCurrentTime(Math.floor(event.target.value));
    audioStore.currentPlaying.audio.currentTime = Math.floor(event.target.value);
    if (event.target.value >= duration) {
      audioStore.setCurrentPlaying({ isEnded: true });
    }
    setAvailableCurrentTime(0);
  };
  const onChangeMute = () => {
    if (audioStore.currentPlaying.audio.volume) {
      audioStore.currentPlaying.audio.volume = 0;
    } else {
      audioStore.currentPlaying.audio.volume = Number(localStorage.getItem('volume'));
    }
    audioStore.setCurrentPlaying({});
  };
  const onControlVolume = event => {
    audioStore.currentPlaying.audio.volume = event.target.value;
    audioStore.setCurrentPlaying({});
    localStorage.setItem('volume', event.target.value);
  };
  const onShowAudioInfoPlate = () => {
    uiStore.changeIsVisibleAudioInfoPlate();
  };

  return (
    <AudioPanelMarkup
      songData={{
        name: audioStore.currentPlaying.name,
        singers: audioStore.currentPlaying.singers,
        currentTime: availableCurrentTime || currentTime,
        duration,
        volume: audioStore.currentPlaying.audio.volume
      }}
      onShuffleQueue={onShuffleQueue}
      onPlayPause={onPlayPause}
      onPrevious={onPrevious}
      onNext={onNext}
      onLoop={onLoop}
      onRewind={onRewind}
      onEndRewind={onEndRewind}
      onChangeMute={onChangeMute}
      onControlVolume={onControlVolume}
      onShowAudioInfoPlate={onShowAudioInfoPlate}
    />
  );
});

export default AudioPanel;