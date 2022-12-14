import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetching } from '../../hooks/useFetching';
import { audioStore } from './../../stores/AudioStore';
import { AudioAPI } from './../../shared/AudioAPI';
import { fetchingWithoutPreloader, RestAPI } from '../../shared/workingWithFetch';
import AlbumOrPlaylistIdMarkup from '../molucules/Markups/AlbumOrPlaylistId/AlbumOrPlaylistIdMarkup'
import EditAlbumPopup from '../templates/EditContentPopups/EditAlbumPopup';
import FormPopup from './../molucules/Popups/FormPopup/FormPopup';
import Span from '../atoms/Span/Span';
import { userStore } from './../../stores/UserStore';
import { uiStore } from './../../stores/UIStore';

const AlbumId = observer(() => {
  const params = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState({});
  const [isEditPopupOpened, setIsEditPopupOpened] = useState(false);
  const [isUploadMenuOpened, setIsUploadMenuOpened] = useState(false);
  const [isConfirmDeletionOpened, setIsConfirmDeletionOpened] = useState(false);

  const onPlay = () => {
    audioStore.setCurrentPlaying(audioStore.availableQueue.queue[0]);
    audioStore.setCurrentQueue(audioStore.availableQueue);
    audioStore.currentPlaying.audio.currentTime = 0;
    audioStore.currentPlaying.audio.play();
  };
  const onEdit = () => {
    if (!userStore.isAuth || userStore.role !== 'ADMIN') {
      return uiStore.setErrorMessage('У вас нет прав администратора');
    }

    setIsEditPopupOpened(true)
  };
  const onUpload = () => {
    if (!userStore.isAuth || userStore.role !== 'ADMIN') {
      return uiStore.setErrorMessage('У вас нет прав администратора');
    }

    setIsUploadMenuOpened(prev => !prev);
  };
  const onHideUploadMenu = () => {
    setIsUploadMenuOpened(false);
    audioStore.setDefaultAvailableQueue();
  };
  const onDelete = () => {
    if (!userStore.isAuth || userStore.role !== 'ADMIN') {
      return uiStore.setErrorMessage('У вас нет прав администратора');
    }

    setIsConfirmDeletionOpened(true);
  };

  const upPopupData = data => {
    setAlbum(prev => {
      return { ...prev, ...data };
    });
  };
  const onClosePopup = () => {
    setIsEditPopupOpened(false);
  };

  const onCancelDeletion = () => {
    setIsConfirmDeletionOpened(false);
  };
  const onConfirmDeletion = useFetching(async () => {
    const { statusCode } = await RestAPI.deleteAlbum({ id: album.id });

    if (statusCode === 200) {
      onCancelDeletion();
      navigate('/home');
    }
  });

  useEffect(() => {
    fetchingWithoutPreloader(async () => {
      const { statusCode, response } = await RestAPI.getAlbum({ id: params.id });

      if (statusCode === 200) {
        setAlbum(response);
      }
    });
  }, [params.id]);

  return (
    <>
      <AlbumOrPlaylistIdMarkup
        type='album'
        id={album?.id}
        name={album?.name}
        singers={album?.singers}
        imageFileName={album?.imageFileName}
        date={album?.date}
        isFavourite={album?.isFavourite}
        songsAmount={album?.songsAmount}
        totalDuration={AudioAPI.formatTime(album?.totalDuration, { withHours: true })}
        audios={audioStore.availableQueue.queue}
        isUploadMenuOpened={isUploadMenuOpened}
        onPlay={onPlay}
        onEdit={onEdit}
        onUpload={onUpload}
        onHideUploadMenu={onHideUploadMenu}
        onDelete={onDelete}
      />
      <EditAlbumPopup
        isOpened={isEditPopupOpened}
        initialData={album}
        upData={upPopupData}
        onClose={onClosePopup}
      />
      <FormPopup isOpened={isConfirmDeletionOpened} onSave={onConfirmDeletion} onClose={onCancelDeletion}>
        <p style={{ textAlign: 'center', alignSelf: 'center' }}>
          Вы уверены, что хотите <Span color='red'>удалить</Span> этот <Span color='red'>альбом</Span>? <br />
          Все входящие в него <Span color='red'>треки будут</Span> также <Span color='red'>удалены</Span>
        </p>
      </FormPopup>
    </>
  );
});

export default AlbumId;