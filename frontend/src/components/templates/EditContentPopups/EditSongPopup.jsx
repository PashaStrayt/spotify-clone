import FormPopup from '../../molucules/Popups/FormPopup/FormPopup';
import { uiStore } from '../../../stores/UIStore';
import { observer } from 'mobx-react-lite';
import { uploadStore } from '../../../stores/UploadStore';
import { RestAPI } from '../../../shared/workingWithFetch';
import { audioStore } from '../../../stores/AudioStore';
import InputAlbum from './../../organisms/Inputs/InputAlbum';
import Input from './../../atoms/Inputs/Input/Input';
import InputSinger from './../../organisms/Inputs/InputSinger';
import { useFetching } from './../../../hooks/useFetching';

const EditSongPopup = observer(() => {
  const nameInputHandler = event => {
    uiStore.setCurrentEditingSong({ name: event.target.value });
  };
  const singerInputHandler = (index, { id, name }) => {
    uiStore.setSingerByIndex(index, { id, name });
  };
  const albumInputHandler = (index, { id: albumId, name: albumName }) => {
    uiStore.setCurrentEditingSong({ albumId, albumName });
  };

  const addOneEmtySinger = () => {
    const index = Object.entries(uiStore.currentEditingSong.singers).length;
    uiStore.setSingerByIndex(index, { id: null, name: '' });
  };

  const fetchUpdateSong = useFetching(async () => {
    const songData = uiStore.currentEditingSong;
    const { statusCode, response } = await RestAPI.updateSong({ songData });

    if (statusCode === 200) {
      const { index, singers, albumName } = uiStore.currentEditingSong;
      audioStore.setInAvalaibleQueueByIndex(index, { ...response, singers, albumName });
    }
  });

  const onSavePopup = () => {
    const songData = uiStore.currentEditingSong;
    if (uiStore.editSongPopup.isPreview) {
      uploadStore.setFileInfo(songData, songData.index);
      audioStore.setCurrentPlaying({});
    } else {
      fetchUpdateSong();
    }

    uiStore.setEditSongPopup({ isVisible: false });
  };
  const onClosePopup = () => {
    uiStore.setEditSongPopup({ isVisible: false });
  };

  return (
    <FormPopup isOpened={uiStore.editSongPopup.isVisible} onSave={onSavePopup} onClose={onClosePopup}>
      <Input
        className='simple'
        value={uiStore.currentEditingSong.name}
        placeholder='Название трека'
        changeHandler={nameInputHandler}
      />

      <InputSinger
        singers={uiStore.currentEditingSong.singers}
        setData={singerInputHandler}
        addOneEmtySinger={addOneEmtySinger}
      />

      <InputAlbum
        name={uiStore.currentEditingSong.albumName}
        setData={albumInputHandler}
      />
    </FormPopup>
  );
});

export default EditSongPopup;