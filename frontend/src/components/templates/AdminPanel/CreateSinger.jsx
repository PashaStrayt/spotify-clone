import { useState, useEffect } from 'react';
import { useFetching } from '../../../hooks/useFetching';
import LabelWithLine from '../../molucules/LabelWithLine/LabelWithLine';
import UploadImage from '../../molucules/UploadImage/UploadImage';
import { useLocation } from 'react-router-dom';
import { RestAPI } from '../../../shared/workingWithFetch';
import FormWithButtons from './../../molucules/FormWithButtons/FormWithButtons';
import Input from './../../atoms/Inputs/Input/Input';
import Button from './../../atoms/Buttons/Button/Button';
import { uiStore } from './../../../stores/UIStore';

const getDefaultSinger = () => {
  return {
    name: '',
    image: { file: null, fileName: '' }
  };
};

const isFormValid = (name) => {
  if (!name) {
    uiStore.setErrorMessage('Название не может быть пустым');
    return false;
  }

  return true;
};

const CreateSinger = () => {
  const [singer, setSinger] = useState();
  const location = useLocation();

  const onCancel = () => {
    setSinger(getDefaultSinger());
  };
  const onSave = useFetching(async () => {
    const { name } = singer;
    if (!isFormValid(name)) {
      return;
    }

    const { statusCode } = await RestAPI.createSinger({
      ...singer, image: singer.image.file
    });

    if (statusCode === 200) {
      onCancel();
    }
  });

  const nameInputHandler = event => {
    const name = event.target.value;
    setSinger({ ...singer, name });
  };
  const setImageInForm = ({ file, fileName }) => {
    setSinger({ ...singer, image: { file, fileName } });
  };

  useEffect(() => {
    onCancel();
  }, [location.pathname]);

  return (
    <FormWithButtons justifyButtons='left' type='admin-panel' onSave={onSave} onCancel={onCancel}>
      <LabelWithLine>Название группы или имя</LabelWithLine>
      <Input
        value={singer?.name ? singer.name : ''}
        placeholder='Название группы или имя'
        changeHandler={nameInputHandler}
      />

      <LabelWithLine>Фото исполнителя</LabelWithLine>
      <UploadImage
        isPreview={true}
        type='album'
        size='big'
        setImageInForm={setImageInForm}
      />
    </FormWithButtons>
  );
};

export default CreateSinger;