import styles from './styles.module.scss';
import { useFetching } from '../../../hooks/useFetching';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Image from '../../atoms/Image/Image';
import className from 'classnames';
import { RestAPI } from '../../../shared/workingWithFetch';
import Input from './../../atoms/Inputs/Input/Input';

const UploadImage = ({ isPreview, type, size, initialFileName, setImageInForm }) => {
  const [image, setImage] = useState({
    file: null, fileName: initialFileName
  });
  const [isHover, setIsHover] = useState(false);
  const location = useLocation();

  const fetchPreviewImage = useFetching(async () => {
    const { response: imageFileName } = await RestAPI.uploadPreviewImage(image.file);

    setImage({ ...image, fileName: imageFileName });
    await setImageInForm({ ...image, fileName: imageFileName });
  });
  const fetchAvatar = useFetching(async () => {
    const fileName = await RestAPI.uploadAvatar(image.file);
    setImage({ ...image, fileName });
  });

  useEffect(() => {
    if (image.file) {
      if (isPreview) {
        fetchPreviewImage();
      } else if (type === 'avatar') {
        fetchAvatar();
      }
    }
  }, [image.file]);
  useEffect(() => {
    if (isPreview) {
      setImage({ file: null, fileName: '' });
    }
  }, [location]);

  return (
    <label
      className={className(styles.self, styles['self--' + type])}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
    >
      {
        image.fileName ?
          <Image
            type={type}
            size={size}
            src={'/' + image.fileName}
            alt={type + ' icon'}
          /> :
          <Image
            type='upload-icon'
            src='/plus-icon.svg'
            alt={'Add icon'}
          />
      }
      {
        image.fileName &&
        <Image
          isVisible={isHover}
          type='upload-icon'
          src='/upload-icon.svg'
          alt={'Upload icon'}
        />
      }
      <Input
        type='file'
        accept='image/jpeg'
        className='file'
        changeHandler={event => {
          setImage({ ...image, file: event.target.files[0] });
        }}
      />
    </label>
  );
};

export default UploadImage;