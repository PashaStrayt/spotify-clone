import { observer } from 'mobx-react-lite';
import InputSinger from '../InputContent/InputSinger';
import InputAlbum from '../InputContent/InputAlbum';
import { uiStore } from '../../store/UIStore';
import { uploadStore } from '../../store/UploadStore';
import Button from '../UI/Button/Button';
import ModalWindow from '../UI/ModalWindow/ModalWindow';
import Input from '../UI/Input/Input';
import { useFetching } from '../../hooks/useFetching';
import { userStore } from '../../store/UserStore';
import { audioStore } from '../../store/AudioStore';

const EditSongWindow = observer(() => {
  const fetchUpdateSong = useFetching(async () => {
    let response = await fetch('/api/song/update', {
      method: 'POST',
      body: JSON.stringify(uiStore.currentEditingSong),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + userStore.token
      }
    });

    if (response.status === 200) {
      response = await response.json();
      const { index, singers, albumName } = uiStore.currentEditingSong;
      audioStore.setInAvalaibleQueueByIndex(index, { ...response, singers, albumName });
    }
  })

  return (
    <ModalWindow>
      <Input
        className='in-adding-content'
        value={uiStore.currentEditingSong.name}
        placeholder='Название трека'
        changeHandler={event => {
          uiStore.setCurrentEditingSong({
            ...uiStore.currentEditingSong,
            name: event.target.value
          });
        }}
      />
      {
        Object.entries(uiStore.currentEditingSong.singers).map((singer, index) =>
          <InputSinger
            singers={uiStore.currentEditingSong.singers}
            value={uiStore.currentEditingSong.singers[index].name}
            key={singer.name + index.toString()}
            index={index}
            adviceClickHandler={(index, { id, name }) => {
              uiStore.setSingerIdAndNameByIndex(index, { id, name });
            }}
            addMoreClickHandler={() => {
              uiStore.setSingerIdAndNameByIndex(index + 1, { id: null, name: '' });
            }}
          />
        )
      }
      <InputAlbum />
      <Button
        className='simple-green'
        clickHandler={async () => {
          if (uiStore.editSongWindow.isPreview) {
            const song = uiStore.currentEditingSong;
            uploadStore.setFileInfo(song, song.index);
          } else {
            fetchUpdateSong();
          }

          uiStore.setEditSongWindow({ isVisible: false });
          uiStore.setButtonIconActive('');
        }}
      >
        Сохранить
      </Button>
      <Button
        className='simple-transparent'
        additionalStyle={{ marginTop: '22px' }}
        clickHandler={() => {
          uiStore.setButtonIconActive('');
          uiStore.setEditSongWindow({ isVisible: false });
        }}
      >
        Отмена
      </Button>
    </ModalWindow>
  );
});

export default EditSongWindow;