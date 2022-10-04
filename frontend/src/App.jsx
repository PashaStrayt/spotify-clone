import { observer } from "mobx-react-lite";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./AppRouter";
import ErrorPopup from './components/organisms/Popups/ErrorPopup';
import { uiStore } from './stores/UIStore';
import EditSongPopup from './components/templates/EditContentPopups/EditSongPopup';
import NavBar from './components/organisms/NavBar/NavBar';
import LoadingWheel from './components/molucules/LoadingWheel/LoadingWheel';
import UserMessagePopup from './components/organisms/Popups/UserMessagePopup';
import AppController from './AppController';
import { audioStore } from './stores/AudioStore';
import AudioPanel from './components/templates/AudioPanel';
import AudioInfoPlate from './components/molucules/AudioInfoPlate/AudioInfoPlate';
import { AudioAPI } from './shared/AudioAPI';

const App = observer(() => {
  return (
    <BrowserRouter>
      <AppController />
      <div style={{ display: 'flex' }}>
        <NavBar />
        <div style={{ width: '100%', marginBottom: '152px' }}>
          <AppRouter />
        </div>
        <AudioInfoPlate
          isOpened={uiStore.isVisibleAudioInfoPlate}
          name={audioStore.currentPlaying.name}
          singers={AudioAPI.makeSingerNames(audioStore.currentPlaying.singers)}
          albumName={audioStore.currentPlaying.albumName}
          albumImage={audioStore.currentPlaying.albumImage}
          format={audioStore.currentPlaying.format}
        />
        {
          audioStore.currentPlaying.name &&
          <AudioPanel />
        }
        {
          uiStore?.editSongPopup?.isVisible &&
          <EditSongPopup />
        }
        <LoadingWheel />
        <ErrorPopup />
        <UserMessagePopup />
      </div>
    </BrowserRouter>
  );
})

export default App;