import { observer } from "mobx-react-lite";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import LoadingWheel from "./components/UI/LoadingWheel/LoadingWheel";
import NavBar from "./components/NavBar/NavBar";
import { uiStore } from "./store/UIStore";
import ErrorWindow from "./components/UI/ErrorWindow";
import AudioController from "./components/AudioController";
import AudioWave from "./components/UI/AudioWave/AudioWave";
import AudioPanel from "./components/AudioPanel/AudioPanel";
import { audioStore } from "./store/AudioStore";
import SongInfoPlate from "./components/UI/SongInfoPlate/SongInfoPlate";

const App = observer(() => {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <AudioController />
        <NavBar />
        <div style={{ width: '100%', marginBottom: '112px'}}>
          <AppRouter />
          {
            uiStore.isLoading &&
            <LoadingWheel />
          }
          {
            !!uiStore.errorMessage &&
            <ErrorWindow />
          }
        </div>
        <SongInfoPlate />
        {
          audioStore.currentPlaying.name &&
          <AudioPanel />
        }
      </div>
    </BrowserRouter>
  );
})

export default App;