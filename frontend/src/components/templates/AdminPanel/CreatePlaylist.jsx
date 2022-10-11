import { useState, useEffect, useCallback } from 'react';
import { useFetching } from '../../../hooks/useFetching';
import LabelWithLine from '../../molucules/LabelWithLine/LabelWithLine';
import UploadImage from '../../molucules/UploadImage/UploadImage';
import { useLocation } from 'react-router-dom';
import { RestAPI } from '../../../shared/workingWithFetch';
import FormWithButtons from './../../molucules/FormWithButtons/FormWithButtons';
import Input from './../../atoms/Inputs/Input/Input';
import { uiStore } from './../../../stores/UIStore';

const getDefaultPlaylist = () => {
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

const CreatePlaylist = () => {
  const [playlist, setPlaylist] = useState();
  const location = useLocation();

  const onCancel = useCallback(() => {
    setPlaylist(getDefaultPlaylist());
  }, []);
  const onSave = useFetching(async () => {
    const { name } = playlist;
    if (!isFormValid(name)) {
      return;
    }

    const { statusCode } = await RestAPI.createPlaylist({
      ...playlist, image: playlist.image.file
    });

    if (statusCode === 200) {
      onCancel();
    }
  });

  const nameInputHandler = event => {
    const name = event.target.value;
    setPlaylist(prev => {
      return { ...prev, name }
    });
  };
  const setImageInForm = ({ file, fileName }) => {
    setPlaylist({ ...playlist, image: { file, fileName } });
  };

  useEffect(() => {
    onCancel();
  }, [location.pathname]);

  return (
    <FormWithButtons justifyButtons='left' type='admin-panel' onSave={onSave} onCancel={onCancel}>
      <LabelWithLine>Название плейлиста</LabelWithLine>
      <Input
        value={playlist?.name ? playlist.name : ''}
        placeholder='Название плейлиста'
        changeHandler={nameInputHandler}
      />

      <LabelWithLine>обложка</LabelWithLine>
      <UploadImage
        isPreview={true}
        type='album'
        size='big'
        setImageInForm={setImageInForm}
      />
    </FormWithButtons>
  );
};

export default CreatePlaylist;