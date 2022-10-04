import { useState, useEffect } from 'react';
import { useFetching } from '../../../hooks/useFetching';
import { uiStore } from '../../../stores/UIStore';
import LabelWithLine from '../../molucules/LabelWithLine/LabelWithLine';
import UploadImage from './../../molucules/UploadImage/UploadImage';
import { useLocation } from 'react-router-dom';
import { RestAPI } from '../../../shared/workingWithFetch';
import FormWithButtons from './../../molucules/FormWithButtons/FormWithButtons';
import Input from './../../atoms/Inputs/Input/Input';
import InputSinger from './../../organisms/Inputs/InputSinger';
import { AudioAPI } from '../../../shared/AudioAPI';

const getDefaultAlbum = () => {
  return {
    name: '',
    singers: { 0: { id: null, name: '' } },
    date: '',
    image: { file: null, fileName: '' }
  };
};

const CreateAlbum = () => {
  const [album, setAlbum] = useState();
  const location = useLocation();

  const onCancel = () => {
    setAlbum(getDefaultAlbum());
  };
  const onSave = useFetching(async () => {
    const { name, singers, date } = album;
    if (!AudioAPI.isAlbumFormValid({ name, singers, date })) {
      return;
    }

    const { statusCode } = await RestAPI.createAlbum({
      ...album, image: album.image.file
    });

    if (statusCode === 200) {
      onCancel();
    }
  });

  const nameInputHandler = event => {
    const name = event.target.value;
    setAlbum({ ...album, name });
  };
  const singerInputHandler = (index, { id, name }) => {
    const singers = {
      ...album.singers,
      [index]: { id, name }
    };

    setAlbum(prev => {
      return { ...prev, singers }
    });
  };
  const addOneEmtySinger = () => {
    const index = Object.entries(album.singers).length;

    singerInputHandler(index, { id: null, name: '' });
  };
  const dateInputHandler = event => {
    const date = event.target.value.slice(0, 4);
    setAlbum(prev => {
      return { ...prev, date };
    });
  };
  const setImageInForm = ({ file, fileName }) => {
    setAlbum({ ...album, image: { file, fileName } });
  };

  useEffect(() => {
    onCancel();
  }, [location.pathname]);

  return (
    <FormWithButtons justifyButtons='left' type='admin-panel' onSave={onSave} onCancel={onCancel}>
      <LabelWithLine>Название альбома</LabelWithLine>
      <Input
        additionalStyle={{ marginBottom: '24px' }}
        value={album?.name ? album.name : ''}
        placeholder='Название альбома'
        changeHandler={nameInputHandler}
      />

      <LabelWithLine>ИСПОЛНИТЕЛИ</LabelWithLine>
      <InputSinger
        singers={album?.singers }
        setData={singerInputHandler}
        addOneEmtySinger={addOneEmtySinger}
      />

      <LabelWithLine>Год выпуска</LabelWithLine>
      <Input
        additionalStyle={{ marginBottom: '24px' }}
        type='number'
        value={album?.date ? album.date : ''}
        placeholder={'Год выпуска'}
        changeHandler={dateInputHandler}
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

export default CreateAlbum;