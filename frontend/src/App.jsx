import { observer } from "mobx-react-lite";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./AppRouter";
import LoadingWheel from "./components/UI/LoadingWheel/LoadingWheel";
import EditSongWindow from "./components/EditContentWindow/EditSongWindow";
import NavBar from "./components/NavBar/NavBar";
import { uiStore } from "./store/UIStore";

const App = observer(() => {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <NavBar />
        <div style={{ width: '100%' }}>
          <AppRouter />
          {
            uiStore.isLoading &&
            <LoadingWheel />
          }
          {
            uiStore.isEditSongWindowVisible &&
            <EditSongWindow />
          }
        </div>
      </div>
    </BrowserRouter>
  );
})

export default App;