import FormPopup from '../../molucules/Popups/FormPopup/FormPopup';
import { observer } from 'mobx-react-lite';
import { RestAPI } from '../../../shared/workingWithFetch';
import Input from '../../atoms/Inputs/Input/Input';
import InputSinger from '../../organisms/Inputs/InputSinger';
import { useFetching } from '../../../hooks/useFetching';
import { useEffect, useState } from 'react';
import { AudioAPI } from '../../../shared/AudioAPI';
import { audioStore } from '../../../stores/AudioStore';

const EditAlbumPopup = observer(({ isOpened, initialData, upData, onClose }) => {
  const [name, setName] = useState();
  const [singers, setSingers] = useState();
  const [date, setDate] = useState();

  const nameInputHandler = event => setName(event.target.value);
  const singerInputHandler = (index, { id, name }) => {
    setSingers(prev => prev.map((singer, prevIndex) => {
      if (prevIndex === index) {
        return { id, name };
      }
      return singer;
    }));
  };
  const dateInputHandler = event => setDate(event.target.value.slice(0, 4));

  const addOneEmtySinger = () => {
    setSingers(prev => [...prev, { id: null, name: '' }]);
  };

  const fetchUpdateAlbum = useFetching(async () => {
    const { statusCode } = await RestAPI.updateAlbum({
      id: initialData.id, name, date, singers
    });

    if (statusCode === 200) {
      onClose();
      upData({ name, singers, date });
      audioStore.changeAlbum({ name, id: initialData.id });
    }
  });

  const onSavePopup = () => {
    if (!AudioAPI.isAlbumFormValid({ name, singers, date })) {
      return;
    }
    fetchUpdateAlbum();
  };

  useEffect(() => {
    setName(initialData.name);
    setSingers(initialData.singers);
    setDate(initialData.date);
  }, [initialData]);

  return (
    <FormPopup isOpened={isOpened} onSave={onSavePopup} onClose={onClose}>
      <Input
        className='simple'
        value={name}
        placeholder='Название альбома'
        changeHandler={nameInputHandler}
      />

      <InputSinger
        singers={singers}
        setData={singerInputHandler}
        addOneEmtySinger={addOneEmtySinger}
      />

      <Input
        className='simple'
        type='number'
        value={date}
        placeholder='Год выпуска'
        changeHandler={dateInputHandler}
      />
    </FormPopup>
  );
});

export default EditAlbumPopup;