import style from './UploadImage.module.scss';
import Input from "../Input/Input";
import Button from '../Button/Button';
import { useFetching } from '../../../hooks/useFetching';
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const UploadImage = ({ className, setImageInForm, clickHandler }) => {
  const [image, setImage] = useState({ file: null, fileName: '' });
  const location = useLocation();

  const fetchImage = useFetching(async () => {
    const formData = new FormData();
    formData.append('0', image.file);

    let imageFileName = await fetch('/api/image/preview', {
      method: 'POST',
      body: formData
    });
    imageFileName = await imageFileName.json();
    setImage({ ...image, fileName: imageFileName });
    await setImageInForm({ ...image, fileName: imageFileName });
  });

  useEffect(() => {
    if (image.file) {
      fetchImage();
    }
  }, [image.file]);

  useEffect(() => {
    setImage({ file: null, fileName: '' });
  }, [location]);

  return (
    <div className={style.container}>
      <label className={[style.label, style['label--' + className]].join(' ')}>
        {
          image.fileName ?
            <img className={style.image} src={'/' + image.fileName} alt="" /> :
            <img className={style.plus} src="/plus-icon.svg" alt="" />
        }
        <Input
          id='image'
          type='file'
          accept='image/jpeg'
          className='file'
          changeHandler={event => {
            setImage({ ...image, file: event.target.files[0] });
          }}
        />
      </label>
      <div className={style['buttons-block']}>
        <Button
          className='simple-transparent'
          clickHandler={event => {
            event.preventDefault();
            setImage({});
            clickHandler();
          }}
        >
          УДАЛИТЬ
        </Button>
        <label htmlFor='image'>
          ВЫБРАТЬ ДРУГУЮ
        </label>
      </div>
    </div>
  );
};

export default UploadImage;