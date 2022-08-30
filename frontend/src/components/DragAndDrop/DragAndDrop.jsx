import { useState } from 'react';
import { checkAcceptFormat, makeValidFormat } from '../../API/files';
import { uploadStore } from '../../store/UploadStore';
import style from './DragAndDrop.module.scss';

const DragAndDrop = () => {
  const [elementVisibility1, setElementVisibility1] = useState('block');
  const [elementVisibility2, setElementVisibility2] = useState('none');

  const dragStartHandler = event => {
    event.preventDefault();
    setElementVisibility1('none');
    setElementVisibility2('block');
  };
  const dragLeaveHandler = event => {
    event.preventDefault();
    setElementVisibility1('block');
    setElementVisibility2('none');
  };
  const dropHandler = event => {
    event.preventDefault();
    setElementVisibility1('block');
    setElementVisibility2('none');

    let files;
    if (event?.dataTransfer?.files) {
      files = [...event.dataTransfer.files];
    } else if (event?.target?.files) {
      files = [...event.target.files];
    } else return;

    files.forEach(file => {
      if (!checkAcceptFormat(file.type)) {
        return;
      }

      uploadStore.pushFiles({
        name: file.name.slice(0, -4) || 'Без названия',
        format: makeValidFormat(file.name),
        albumName: 'Без альбома',
        albumImage: '/album-image.svg',
        singers: { 0: { id: null, name: 'Не известен' } },
        duration: '—',
        albumId: null
      }, file);
    });
  };

  return (
    <div
      className={style['drag-n-drop']}
      onDragOver={dragStartHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={dropHandler}
    >
      <img className={style.icon} src="/upload-icon-a.svg" alt="" />
      <p
        className={style['put-here']}
        style={{ display: elementVisibility2 }}
      >
        Отпустите, чтобы загрузить файлы
      </p>
      <p
        className={style['put-here']}
        style={{ display: elementVisibility1 }}
      >
        Перетащите сюда
      </p>
      <p
        className={style.or}
        style={{ display: elementVisibility1 }}
      >
        или
      </p>
      <input
        type='file'
        id='input-file'
        className={style['upload-files__input']}
        multiple
        accept='audio/wav,audio/mp3,audio/ogg,audio/m4a,audio/flac'
        onChange={dropHandler}
      />
      <label
        htmlFor="input-file"
        className={style['upload-files']}
        style={{ display: elementVisibility1 }}
      >
        Выберите файлы
      </label>
    </div>
  );
};

export default DragAndDrop;