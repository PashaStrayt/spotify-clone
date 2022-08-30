import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetching, makeSongsArray } from "../API/audio";
import { audioStore } from "../store/AudioStore";
import { userStore } from "../store/UserStore";

const AudioController = observer(() => {
  const location = useLocation();

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

  return (
    <div style={{ width: 0, height: 0 }}></div>
  );
});

export default AudioController;