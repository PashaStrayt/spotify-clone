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
import ContextMenu from "./components/UI/ContextMenu/ContextMenu";
import LinkWithIcon from "./components/UI/LinkWithIcon/LinkWithIcon";
import { userStore } from "./store/UserStore";
import EditSongWindow from "./components/EditContentWindow/EditSongWindow";

const App = observer(() => {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <AudioController />
        <NavBar />
        <div style={{ width: '100%', marginBottom: '112px' }}>
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
        {
          uiStore.whichButtonIconActive === 'user-menu' &&
          <ContextMenu additionalStyle={{ top: '245px', left: '116px' }}>
            <LinkWithIcon
              linkName='sign-out'
              className='with-icon-and-background'
              clickHandler={() => {
                uiStore.setButtonIconActive('');
                userStore.setStateAndCookie('isAuth', false);
                userStore.setStateAndCookie('token', '');
                audioStore.setCurrentPlaying({});
              }}
            />
            <LinkWithIcon
              linkName='user-settings'
              className='with-icon-and-background'
              clickHandler={() => uiStore.setButtonIconActive('')}
            />
          </ContextMenu>
        }
        {
          uiStore.isVisibleSongInfoPlate === 'true' &&
          <SongInfoPlate />
        }
        {
          uiStore?.editSongWindow?.isVisible &&
          <EditSongWindow />
        }
        {
          audioStore.currentPlaying.name &&
          <AudioPanel />
        }
      </div>
    </BrowserRouter>
  );
})

export default App;