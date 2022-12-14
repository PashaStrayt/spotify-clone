import { observer } from 'mobx-react-lite';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetching } from '../../hooks/useFetching';
import { audioStore } from '../../stores/AudioStore';
import { AudioAPI } from '../../shared/AudioAPI';
import { RestAPI } from '../../shared/workingWithFetch';
import PlaylistOrPlaylistIdMarkup from '../molucules/Markups/PlaylistOrPlaylistId/PlaylistOrPlaylistIdMarkup'
import EditPlaylistPopup from '../templates/EditContentPopups/EditPlaylistPopup';
import FormPopup from '../molucules/Popups/FormPopup/FormPopup';
import Span from '../atoms/Span/Span';

const PlaylistId = observer(() => {
  const params = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState({});
  const [isEditPopupOpened, setIsEditPopupOpened] = useState(false);
  const [isAddMenuOpened, setIsAddMenuOpened] = useState(false);
  const [isConfirmDeletionOpened, setIsConfirmDeletionOpened] = useState(false);

  const fetchPlaylist = useFetching(async () => {
    const { statusCode, response } = await RestAPI.getPlaylist({ id: params.id });

    if (statusCode === 200) {
      setPlaylist(response);
    }
  });
  const onPlay = useCallback(() => {
    audioStore.setCurrentPlaying(audioStore.availableQueue.queue[0]);
    audioStore.setCurrentQueue(audioStore.availableQueue);
    audioStore.currentPlaying.audio.currentTime = 0;
    audioStore.currentPlaying.audio.play();
  }, []);
  const onEdit = useCallback(() => setIsEditPopupOpened(true), []);
  const onUpload = useCallback(() => {
    setIsAddMenuOpened(prev => !prev);
  }, []);
  const onHideUploadMenu = useCallback(() => {
    setIsAddMenuOpened(false);
    audioStore.setDefaultAvailableQueue();
  }, []);
  const onDelete = useCallback(() => {
    setIsConfirmDeletionOpened(true);
  }, []);

  const upPopupData = data => {
    setPlaylist(prev => {
      return { ...prev, ...data };
    });
  };
  const onClosePopup = useCallback(() => {
    setIsEditPopupOpened(false);
  }, []);

  const onCancelDeletion = useCallback(() => {
    setIsConfirmDeletionOpened(false);
  }, []);
  const onConfirmDeletion = useFetching(async () => {
    const { statusCode } = await RestAPI.deletePlaylist({ id: playlist.id });

    if (statusCode === 200) {
      onCancelDeletion();
      navigate('/home');
    }
  });

  useEffect(() => {
    fetchPlaylist();
  }, []);
  return (
    <>
      <PlaylistOrPlaylistIdMarkup
        type='playlist'
        id={playlist?.id}
        name={playlist?.name}
        singers={playlist?.singers}
        imageFileName={playlist?.imageFileName}
        date={playlist?.date}
        isFavourite={playlist?.isFavourite}
        songsAmount={playlist?.songsAmount}
        totalDuration={AudioAPI.formatTime(playlist?.totalDuration, { withHours: true })}
        audios={audioStore.availableQueue.queue}
        isAddMenuOpened={isAddMenuOpened}
        onPlay={onPlay}
        onEdit={onEdit}
        onUpload={onUpload}
        onHideUploadMenu={onHideUploadMenu}
        onDelete={onDelete}
      />
      <EditPlaylistPopup
        isOpened={isEditPopupOpened}
        initialData={playlist}
        upData={upPopupData}
        onClose={onClosePopup}
      />
      <FormPopup isOpened={isConfirmDeletionOpened} onSave={onConfirmDeletion} onClose={onCancelDeletion}>
        <p style={{ textAlign: 'center', alignSelf: 'center' }}>
          ???? ??????????????, ?????? ???????????? <Span color='red'>??????????????</Span> ???????? <Span color='red'>????????????????</Span>? <br />
          ???? ???????? ???? ???????????????? ?? ???????? ???????????? ???? ?????????? ????????????.
        </p>
      </FormPopup>
    </>
  );
});

export default PlaylistId;