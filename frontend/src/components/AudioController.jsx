import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetching, makeSongsArray } from "../API/audio";
import { audioStore } from "../store/AudioStore";
import { userStore } from "../store/UserStore";

let interval;
let isMouseDown;

const AudioController = observer(() => {
  const location = useLocation();

  useEffect(() => {
    document.addEventListener('mousedown', event => {
      if (event.target.className.includes('audio-time-scale')) {
        isMouseDown = true;
        const endPoint = Math.floor(event.pageX - event.target.offsetLeft);
        const progress = endPoint / (event.target.offsetWidth / audioStore.currentPlaying.duration);
        audioStore.currentPlaying.audio.currentTime = Math.floor(progress);
        event.target.value = progress;
      }
    });

    document.addEventListener('mousemove', event => {
      if (isMouseDown) {
        const endPoint = Math.floor(event.pageX - event.target.offsetLeft);
        const progress = endPoint / (event.target.offsetWidth / audioStore.currentPlaying.duration);
        audioStore.currentPlaying.audio.currentTime = Math.floor(progress);
        event.target.value = progress;
      }
    });

    document.addEventListener('mouseup', event => {
      isMouseDown = false;
      if (event.target.className.includes('audio-time-scale')) {
        const endPoint = Math.floor(event.pageX - event.target.offsetLeft);
        const progress = endPoint / (event.target.offsetWidth / audioStore.currentPlaying.duration);
        audioStore.currentPlaying.audio.currentTime = Math.floor(progress);
        event.target.value = progress;
      }
    });
  }, []);

  // Setting current playing song from local storage with 1st load site
  useEffect(() => {
    const lastPlayed = JSON.parse(localStorage.getItem('lastPlayed'));
    audioStore.setCurrentPlaying(lastPlayed);
  }, []);

  // Setting new available queue if changing page
  useEffect(() => {
    audioStore.setDefaultAvailableQueue();
    let request = {
      url: '',
      isNeededAuthorizationHeader: false,
      method: 'GET'
    };
    switch (location.pathname) {
      case '/home':
        request.url = `/api/song/get-all?${userStore.isAuth === 'true' ? 'userId=' + userStore.userId + '&' : ''}page=1`;
        break;
      default:
        break;
    }
    if (request.url) {

      fetching(async () => {
        let response = await fetch(request.url, {
          method: request.method,
          headers: {
            'Authorization': 'bearer ' + userStore.token
          }
        });
        response = await response.json();
        response = await makeSongsArray(response);
        audioStore.setAvailableQueue({ queue: response });
      });
    }
  }, [location]);

  // Setting new available queue if changing page
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

  return (
    <div style={{ width: 0, height: 0 }}></div>
  );
});

export default AudioController;