import { observer } from 'mobx-react-lite';
import InputSinger from '../InputContent/InputSinger';
import InputAlbum from '../InputContent/InputAlbum';
import { uiStore } from '../../store/UIStore';
import { uploadStore } from '../../store/UploadStore';
import Button from '../UI/Button/Button';
import ModalWindow from '../UI/ModalWindow/ModalWindow';
import Input from '../UI/Input/Input';

const EditSongWindow = observer(() => {
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
              uiStore.setSingerIdAndNameByIndex(index + 1, { id: null, name: 'Не известен' });
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