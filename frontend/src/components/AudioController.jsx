import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetching, makeSongsArray } from "../API/audio";
import { audioStore } from "../store/AudioStore";
import { userStore } from "../store/UserStore";

let interval;

const AudioController = observer(() => {
  const location = useLocation();

  const getRequestData = () => {
    let url;

    if (location.pathname === '/home') {
      url = `/api/song/get-all?${userStore.isAuth === 'true' ? 'userId=' + userStore.userId + '&' : ''}page=${audioStore.availableQueue.page}`;
    } else if (location.pathname.includes('/album')) {
      const albumId = location.pathname.slice(7);
      url = `/api/song/get-from-album?${userStore.isAuth === 'true' ? 'userId=' + userStore.userId + '&' : ''}albumId=${albumId}&page=${audioStore.availableQueue.page}`;
    } else {
      return false;
    }

    return [url, {
      method: 'GET', headers: {
        'Authorization': 'bearer ' + userStore.token
      }
    }];
  };

  // Setting default available queue if changing page
  useEffect(() => {
    audioStore.setDefaultAvailableQueue();
  }, [location]);

  // Update available queue for infinity scroll
  useEffect(() => {
    if (audioStore.availableQueue.page === 0) {
      return audioStore.setAvailableQueue({ page: 1 });
    };

    const request = getRequestData();

    if (request) {
      fetching(async () => {
        let response = await fetch(...request);
        audioStore.setAvailableQueue({ totalPages: response.headers.get('Total-Pages') });
        response = await response.json();

        if (Array.isArray(response) && response.length) {
          response = await makeSongsArray(response);
          audioStore.pushInAvailableQueue(response);
        }
      });
    }
  }, [audioStore.availableQueue.page]);

  // Kludge to have rerender currentTime in component Progress
  useEffect(() => {
    if (audioStore.currentPlaying.audio.paused) {
      clearInterval(interval);
    } else {
      audioStore.setCurrentPlaying({
        currentTime: audioStore.currentPlaying.audio.currentTime
      });

      interval = setInterval(() => {
        audioStore.setCurrentPlaying({
          currentTime: audioStore.currentPlaying.audio.currentTime
        });
      }, 1000);
    }
  }, [audioStore.currentPlaying.audio.paused]);

  // Handle beforeunload event
  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      audioStore.setCurrentPlaying({
        currentTime: audioStore.currentPlaying.audio.currentTime,
        volume: audioStore.currentPlaying.audio.volume
      });
      localStorage.setItem('lastPlayed', JSON.stringify(audioStore.currentPlaying));
      localStorage.setItem('lastQueue', JSON.stringify(audioStore.currentQueue));
    });
  }, []);

  // Play the next song from current queue
  useEffect(() => {
    if ((audioStore.currentPlaying.isEnded || audioStore.currentPlaying.audio.ended) && !audioStore.currentPlaying.audio.loop) {
      const nextSongIndex = audioStore.currentPlaying.index + 1;

      if (nextSongIndex <= audioStore.currentQueue.queue.length - 1) {
        audioStore.setNextCurrentPlaying(nextSongIndex);
        audioStore.currentPlaying.audio.play();
        audioStore.setCurrentPlaying({ isEnded: false });
      } else {
        audioStore.setCurrentQueue({ isEnded: true });
      }
    } else if (audioStore.currentPlaying.isEnded || audioStore.currentPlaying.audio.ended) {
      audioStore.currentPlaying.audio.currentTime = 0;
      audioStore.setCurrentPlaying({ isEnded: false });
    }
  }, [audioStore.currentPlaying.audio.ended, audioStore.currentPlaying.isEnded]);

  // Update current queue, if it's ended, and continue listening, if it was
  useEffect(() => {
    if (audioStore.currentQueue.isEnded) {
      const lastSongIndex = audioStore.currentPlaying.index;
      audioStore.setCurrentQueue({ page: audioStore.currentQueue.page + 1 });

      const request = getRequestData();

      if (request && audioStore.currentQueue.page <= audioStore.currentQueue.totalPages) {
        fetching(async () => {
          let response = await fetch(...request);
          audioStore.setCurrentQueue({ totalPages: response.headers.get('Total-Pages') });
          response = await response.json();

          if (Array.isArray(response) && response.length) {
            response = await makeSongsArray(response);
            audioStore.pushInCurrentQueue(response);

            if (audioStore.currentPlaying.audio.ended && audioStore.currentPlaying.index === lastSongIndex) {
              audioStore.setNextCurrentPlaying(lastSongIndex);
              audioStore.currentPlaying.audio.play();
            }
          }
        });
      }
    }
  }, [audioStore.currentQueue.isEnded]);

  return (
    <div style={{ width: 0, height: 0 }}></div>
  );
});

export default AudioController;