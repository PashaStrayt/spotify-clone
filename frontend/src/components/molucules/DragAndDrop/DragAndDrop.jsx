import { useState } from 'react';
import styles from './styles.module.scss';
import { PROXY_URL } from './../../../shared/workingWithFetch';

const DragAndDrop = ({ upFiles, accept }) => {
  const [isDragged, setIsDragged] = useState(false);

  const dragStartHandler = event => {
    event.preventDefault();
    setIsDragged(true);
  };
  const dragLeaveHandler = event => {
    event.preventDefault();
    setIsDragged(false);
  };
  const onLoadFiles = event => {
    event.preventDefault();
    setIsDragged(false);

    let files;
    if (event?.dataTransfer?.files) {
      files = event?.dataTransfer?.files;
    } else if (event?.target?.files) {
      files = event?.target?.files;
    }
    
    upFiles([...files]);
  };

  return (
    <div
      className={styles.container}
      onDragOver={dragStartHandler}
      onDragLeave={dragLeaveHandler}
      onDrop={onLoadFiles}
    >

      <img className={styles.icon} src={PROXY_URL + "/upload-icon.svg"} alt="" />

      {
        isDragged ?
          <p className={styles['put-here']}>
            Отпустите, чтобы загрузить файлы
          </p> :
          <>
            <p className={styles['put-here']}>
              Перетащите сюда
            </p>

            <p className={styles.or}>
              или
            </p>

            <label className={styles['upload-files']}>
              <input
                type='file'
                id='input-file'
                className={styles['upload-files__input']}
                multiple
                accept={accept}
                onChange={onLoadFiles}
              />
              Выберите файлы
            </label>
          </>
      }
    </div>
  );
};

export default DragAndDrop;