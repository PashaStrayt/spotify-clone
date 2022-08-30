import { observer } from "mobx-react-lite";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import LoadingWheel from "./components/UI/LoadingWheel/LoadingWheel";
import NavBar from "./components/NavBar/NavBar";
import { uiStore } from "./store/UIStore";
import ErrorWindow from "./components/UI/ErrorWindow";
import AudioController from "./components/AudioController";
import AudioWave from "./components/UI/AudioWave/AudioWave";

const App = observer(() => {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <AudioController />
        <NavBar />
        <div style={{ width: '100%' }}>
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
      </div>
    </BrowserRouter>
  );
})

export default App;