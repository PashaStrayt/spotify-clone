import style from './AlbumIdPage.module.scss';
import Header from '../../components/UI/Header/Header';
import AudioList from '../../components/AudioList/AudioList';
import { audioStore } from '../../store/AudioStore';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useFetching } from '../../hooks/useFetching';
import { makeTotalDurationQueue, makeSingerNames, makeDurationString } from '../../API/audio';
import ButtonIcon from '../../components/UI/ButtonIcon/ButtonIcon';
import ButtonFavourite from '../../components/UI/ButtonFavourite/ButtonFavourite';

const makeAlbum = async album => {
  const { id, name, date, imageFileName, AlbumSinger, isFavourite } = album;

  const singers = AlbumSinger.map(({ id, name }) => {
    return { id, name };
  });

  return {
    id, name, date, imageFileName, singers, isFavourite
  };
}

const AlbumOrPlaylistId = observer(() => {
  const params = useParams();
  const [album, setAlbum] = useState({});
  const fetchAlbum = useFetching(async () => {
    const url = '/api/album/' + params.id;

    let response = await fetch(url);
    response = await response.json();
    response = await makeAlbum(response);
    setAlbum(response);
  });

  useEffect(() => {
    fetchAlbum();
  }, []);
  useEffect(() => {
  }, [album]);
  // 
  return (
    <div className={style.container}>
      <header className={style.header}>
        <img src={album.imageFileName ? '/' + album.imageFileName : "/album-image.svg"} alt="" className={style['header__content-image']} />
        <div className={style['header__content-info']}>
          <p className={style['content-info__type']}>альбом, {album.date}</p>
          <Header className='primary'>{album.name}</Header>
          <p className={style['content-info__singers']}>{!!album?.singers && makeSingerNames(album?.singers)}</p>
          <p
            className={style['content-info__duration']}
          >
            {audioStore?.availableQueue?.queue?.length} songs, {makeDurationString(makeTotalDurationQueue(audioStore.availableQueue.queue)).split(' ').join('')}
          </p>
        </div>
      </header>
      <div className={style.plate}>
        <div className={style.plate__buttons}>
          <ButtonIcon 
          buttonName='play-album' 
          additionalStyle={{ marginRight: '16px' }} 
            clickHandler={() => {
              audioStore.setCurrentPlaying(audioStore.availableQueue.queue[0]);
              audioStore.setCurrentQueue(audioStore.availableQueue);
              audioStore.currentPlaying.audio.currentTime = 0;
              audioStore.currentPlaying.audio.play();
            }}
          />
          <ButtonFavourite 
            size='big'
            isActive={album.isFavourite}
           />
          <ButtonIcon buttonName='edit-album' />
          <ButtonIcon buttonName='delete-album' />
        </div>
        {
          audioStore.availableQueue.queue?.length > 0 &&
          <AudioList isPreview={false} audios={audioStore.availableQueue.queue} currentAlbumId={params.id} />
        }
      </div>
    </div>
  );
});

export default AlbumOrPlaylistId;