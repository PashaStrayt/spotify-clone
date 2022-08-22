import { observer } from 'mobx-react-lite';
import InputSinger from '../InputContent/InputSinger';
import InputAlbum from '../InputContent/InputAlbum';
import { uiStore } from '../../store/UIStore';
import { uploadStore } from '../../store/UploadStore';
import Button from '../UI/Button/Button';
import ModalWindow from '../UI/ModalWindow/ModalWindow';
import Input from '../UI/Input/Input';

const EditSongWindow = observer(({ isPreview, setVisible }) => {
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
      <InputSinger />
      <InputAlbum />
      <Button
        className='simple-green'
        clickHandler={async () => {
          setVisible(false);
          uiStore.setButtonIconActive('');

          if (isPreview) {
            const song = uiStore.currentEditingSong;
            uploadStore.setFileInfo(song, song.index)
          } else {

          }
        }}
      >
        Сохранить
      </Button>
      <Button
        className='simple-transparent'
        additionalStyle={{ marginTop: '22px' }}
        clickHandler={() => {
          uiStore.setButtonIconActive('');
          setVisible(false);
        }}
      >
        Отмена
      </Button>
    </ModalWindow>
  );
});

export default EditSongWindow;