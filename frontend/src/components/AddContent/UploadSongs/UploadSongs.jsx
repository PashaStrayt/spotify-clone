import { observer } from "mobx-react-lite";
import { userStore } from "../../../store/UserStore";
import DragAndDrop from "../../DragAndDrop/DragAndDrop";
import AudioList from '../../AudioList/AudioList';
import Button from "../../UI/Button/Button";
import { makeFilesArray } from "../../../API/files";
import { useFetching } from "../../../hooks/useFetching";
import { uploadStore } from "../../../store/UploadStore";
import style from './UploadSongs.module.scss';

const Songs = observer(() => {
  const uploadSongs = useFetching(async () => {
    await fetch('/api/song', {
      method: 'POST',
      body: makeFilesArray(),
      headers: {
        'Authorization': 'bearer ' + userStore.token
      }
    });

    uploadStore.setDefaultFiles();
  })

  return (
    <div className="wrapper">
      <DragAndDrop />
      {
        uploadStore.files?.info.length > 0 &&
        <div>
          <p className={style['upload-more']}>загрузите еще</p>
          <p className={style.or}>или</p>
          <div className={style['buttons-block']}>
            <Button
              className='simple-green'
              clickHandler={uploadSongs}
            >
              Готово
            </Button>
            <Button
              className='simple-transparent'
              clickHandler={() => uploadStore.setDefaultFiles()}
            >
              Отмена
            </Button>
          </div>
          <AudioList isPreview={true} audios={uploadStore.files.info} />
        </div>
      }
    </div>
  );
});

export default Songs;