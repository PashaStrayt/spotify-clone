import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RestAPI, fetching } from "./shared/workingWithFetch";
import { AudioAPI } from "./shared/AudioAPI";
import { audioStore } from "./stores/AudioStore";
import { uiStore } from "./stores/UIStore";
import { userStore } from "./stores/UserStore";

let interval;

const AppController = observer(() => {
  const location = useLocation();

  const getRequestData = () => {
    let requestData = {};

    if (location.pathname === '/home') {
      requestData = {
        url: '/api/song/get-all',
        query: {
          userId: userStore.isAuth ? userStore.userId : '',
          page: audioStore.availableQueue.page,
          method: 'GET'
        }
      };
    } else if (
      location.pathname.includes('/album') &&
      !location.pathname.includes('admin-panel') &&
      !location.pathname.includes('home') &&
      !location.pathname.includes('search') &&
      !location.pathname.includes('favourite')
    ) {
      requestData = {
        url: '/api/song/get-from-album',
        query: {
          userId: userStore.isAuth ? userStore.userId : '',
          page: audioStore.availableQueue.page,
          albumId: location.pathname.slice(7),
          method: 'GET'
        }
      };
    } else if (location.pathname === '/favourite/songs') {
      requestData = {
        url: '/api/song/favourite',
        query: {
          page: audioStore.availableQueue.page,
          method: 'GET'
        }
      };
    } else if (location.pathname === '/search/songs') {
      if (!uiStore.searchQuery) {
        return;
      }

      requestData = {
        url: '/api/song/favourite',
        query: {
          page: audioStore.availableQueue.page,
          searchQuery: uiStore.searchQuery,
          method: 'GET'
        }
      };
    } else {
      return false;
    }

    return requestData;
  };
  // Setting default available queue if changing page
  useEffect(() => {
    if (location.pathname !== '/') {
      audioStore.setDefaultAvailableQueue();
      audioStore.setDefaultAlbums();
    }
  }, [location]);

  // Update available queue for infinity scroll
  useEffect(() => {
    if (location.pathname === '/') {
      return;
    }

    if (audioStore.availableQueue.page <= 0) {
      return audioStore.setAvailableQueue({ page: 1 });
    };

    const request = getRequestData();

    if (request) {
      fetching(async () => {
        let { headers, response } = await RestAPI.advancedFetch(request);
        audioStore.setAvailableQueue({ totalPages: headers.totalPages });

        if (Array.isArray(response) && response.length) {
          response = await AudioAPI.makeSongsArray(response);
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

  // Handle resize event
  useEffect(() => {
    const calcStringLimits = () => {
      const width = window.innerWidth;

      if (5090 <= width) {
        uiStore.setStringLimit({ name: 180, singers: 190, album: 255 });
      } else if (4000 <= width && width < 5090) {
        uiStore.setStringLimit({ name: 124, singers: 133, album: 230 });
      } else if (3000 <= width && width < 4000) {
        uiStore.setStringLimit({ name: 74, singers: 80, album: 130 });
      } else if (2500 <= width && width < 3000) {
        uiStore.setStringLimit({ name: 51, singers: 54, album: 90 });
      } else if (2400 <= width && width < 2500) {
        uiStore.setStringLimit({ name: 45, singers: 50, album: 90 });
      } else if (1920 <= width && width < 2500) {
        uiStore.setStringLimit({ name: 22, singers: 20, album: 37 });
      } else if (1600 <= width && width < 1920) {
        uiStore.setStringLimit({ name: 5, singers: 5, album: 7 });
      } else if (1200 <= width && width < 1600) {
        uiStore.setStringLimit({ name: 7, singers: 7, album: 8 });
      }
    }

    window.addEventListener('resize', () => {
      calcStringLimits();
    });
    calcStringLimits();
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
          let [headers, response] = await RestAPI.advancedFetch(request);
          audioStore.setCurrentQueue({ totalPages: headers.totalPages });

          if (Array.isArray(response) && response.length) {
            response = await AudioAPI.makeSongsArray(response);
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

  // Update albums for infinity scroll
  useEffect(() => {
    if (audioStore.albums.page <= 0) {
      return audioStore.setAlbums({ page: 1 });
    }

    const lp = location.pathname;
    if (
      lp === '/' ||
      (lp.includes('/search') && !uiStore.searchQuery)
    ) {
      return;
    }

    let statusCode, response, headers;


    fetching(async () => {
      if (location.pathname === '/home') {
        ({ statusCode, response, headers } = await RestAPI.getAllAlbums({ page: 1, limit: 5 }));
      } else if (location.pathname === '/home/albums') {
        ({ statusCode, response, headers } = await RestAPI.getAllAlbums({
          page: audioStore.albums.page
        }));
      } else if (location.pathname === '/favourite/albums') {
        ({ statusCode, response, headers } = await RestAPI.getFavouriteAlbums({
          page: audioStore.albums.page
        }));
      } else if (location.pathname === '/search/albums') {
        if (!uiStore.searchQuery) {
          return;
        }

        const { statusCode, response, headers } = await RestAPI.searchAlbums({
          page: audioStore.albums.page,
          searchQuery: uiStore.searchQuery
        });

        if (statusCode === 200 && Array.isArray(response) && response.length) {
          audioStore.setAlbums({ totalPages: headers.totalPages });
          audioStore.pushInAlbumsList(response);
        }
      }

      if (statusCode === 200 && Array.isArray(response) && response.length) {
        audioStore.setAlbums({ totalPages: headers.totalPages });
        audioStore.pushInAlbumsList(response);
      }
    });
  }, [audioStore.albums.page]);

  useEffect(() => {
    const lp = location.pathname;
    if (
      !lp.includes('/home') &&
      !lp.includes('/favourite')
    ) {
      window.addEventListener('load', () => {
        uiStore.setIsLoading2(false);
        console.log('PAGE LOADED');
      });
    }
  }, []);

  return null;
});

export default AppController;