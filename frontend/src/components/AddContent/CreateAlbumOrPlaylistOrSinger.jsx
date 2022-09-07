import Form from '../UI/Form/Form';
import Label from '../UI/Label/Label';
import Input from '../UI/Input/Input';
import { useState } from 'react';
import InputSinger from '../InputContent/InputSinger';
import { deepCopy } from '../../API/files'
import UploadImage from '../UI/UploadImage/UploadImage';
import { useFetching } from '../../hooks/useFetching';
import { uiStore } from '../../store/UIStore';
import Button from '../UI/Button/Button';
import { userStore } from '../../store/UserStore';
import { useEffect } from 'react';

const getDefaultState = contentType => {
  if (contentType === 'album') {
    return {
      name: '',
      singers: [{ id: null, name: '' }],
      date: '',
      image: { file: null, fileName: '' }
    }
  } else {
    return {
      name: '',
      image: { file: null, fileName: '' }
    }
  }
};

const CreateAlbumOrPlaylistOrSinger = ({ contentType }) => {
  const [content, setContent] = useState(getDefaultState(contentType));

  const isFormValidated = () => {
    if (!content.name) {
      uiStore.setErrorMessage('Название не может быть пустым');
      return false;
    }
    if (contentType === 'album' && (!content.date || content.date.length !== 4)) {
      uiStore.setErrorMessage('Введите корректный год выпуска в формате "xxxx"');
      return false;
    }
    if (contentType === 'album') {
      for (let singer of content.singers) {
        if (!singer.id) {
          uiStore.setErrorMessage('Все исполнители должны быть выбраны с помощью подсказок');
          return false;
        }
      }
    }
    return true;
  };

  const submitForm = useFetching(async () => {
    if (!isFormValidated()) return;

    const formData = new FormData();
    formData.append('name', content.name);
    formData.append('image', content.image.file);
    if (contentType === 'album') {
      formData.append('singers', JSON.stringify(content.singers));
      formData.append('date', content.date);
    }


    const url = '/api/' + contentType;
    let response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'bearer ' + userStore.token
      }
    });

    if (response.status === 200) {
      setContent(getDefaultState(contentType))
    }
  });

  useEffect(() => {
    setContent(getDefaultState(contentType));
  }, [contentType]);

  return (
    <Form className='create-album-or-playlist'>
      <Label
        className='in-creating-content'
        text={contentType === 'singer' ? 'НАЗВАНИЕ ГРУППЫ ИЛИ ИМЯ ЧЕЛОВЕКА' : 'НАЗВАНИЕ'}
      />
      <Input
        className='in-adding-content'
        additionalStyle={{ marginBottom: '34px' }}
        value={'' || content?.name}
        placeholder={'Название'}
        changeHandler={event => {
          setContent({ ...content, name: event.target.value })
        }}
      />
      {
        contentType === 'album' &&
        <Label
          className='in-creating-content'
          text='ИСПОЛНИТЕЛИ'
        />
      }
      {
        content?.singers?.length && contentType === 'album' &&
        Object.entries(content.singers).map((singer, index) =>
          <InputSinger
            additionalStyle={{ marginBottom: '10px' }}
            singers={content.singers}
            value={'' || content.singers[index].name}
            key={singer.name + index.toString()}
            index={index}
            adviceClickHandler={(index, { id, name }) => {
              const singers = deepCopy(content.singers);
              singers[index] = { id, name };

              setContent({
                ...content,
                singers
              });
            }}
            addMoreClickHandler={() => {
              setContent({
                ...content,
                singers: [...content.singers, { id: null, name: 'Не известен' }]
              });
            }}
          />
        )
      }
      {
        contentType === 'album' &&
        <Label
          className='in-creating-content'
          additionalStyle={{ marginBlock: '34px 20px' }}
          text='ГОд выпуска'
        />
      }
      {
        content.hasOwnProperty('date') && contentType === 'album' &&
        <Input
          className='in-adding-content'
          additionalStyle={{ marginBottom: '34px' }}
          value={content?.date}
          placeholder={'Год выпуска'}
          changeHandler={event => {
            const value = event.target.value;
            if (value.match(/^\d+$/) && value.length <= 4) {
              setContent({ ...content, date: event.target.value });
            } else if (!value) {
              setContent({ ...content, date: '' });
            }
          }}
        />
      }
      <Label
        className='in-creating-content'
        text='обложка'
      />
      <UploadImage
        className='album-playlist-image'
        setImageInForm={async image => {
          setContent({ ...content, image });
        }}
        clickHandler={() => {
          setContent({ ...content, image: { file: null, fileName: '' } });
        }}
      />
      <Button
        className='simple-green'
        type='reset'
        additionalStyle={{ maxWidth: '232px', width: '100%', margin: '44px 22px 0 0' }}
        clickHandler={submitForm}
      >
        Готово
      </Button>
      <Button
        className='simple-transparent'
        type='reset'
        additionalStyle={{ maxWidth: '232px', width: '100%', margin: '44px 44px 0 0' }}
        clickHandler={() => setContent(getDefaultState(contentType))}
      >
        Отмена
      </Button>
    </Form>
  );
};

export default CreateAlbumOrPlaylistOrSinger;