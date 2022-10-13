import { useState, useEffect } from 'react';
import { useFetching } from '../../hooks/useFetching';
import { observer } from 'mobx-react-lite';
import { RestAPI } from '../../shared/workingWithFetch';
import { userStore } from './../../stores/UserStore';
import { audioStore } from './../../stores/AudioStore';
import { uiStore } from './../../stores/UIStore';
import { deepCopy } from './../../shared/workingWithTypes';
import { uploadStore } from './../../stores/UploadStore';
import AudioItemMarkupRow from './../molucules/Markups/AudioRows/AudioItemMarkupRow';

// isPreview,
// isPrivate,
// id,
// name,
// format,
// albumName,
// albumImage,
// singers,
// albumId,
// playlistId,
// duration,
// fileName,
// number,
// isFavourite

const AudioItem = observer(props => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const fetchDeleteSong = useFetching(async () => {
    let statusCode;
    if (props.playlistId) {
    } else {
      ({ statusCode } = await RestAPI.deleteSong({
        songId: props.id, isPrivate: props.isPrivate, userId: userStore.userId
      }));
    }

    if (statusCode === 200) {
      audioStore.deleteFromAvailableQueue(props.number - 1);
      audioStore.setCurrentPlaying({});
    }
  });
  const onEdit = event => {
    event.stopPropagation();

    if (!userStore.isAuth || userStore.role !== 'ADMIN') {
      return uiStore.setErrorMessage('У вас нет прав администратора');
    }

    uiStore.setEditSongPopup({ isVisible: true, isPreview: props.isPreview });
    const song = {
      id: props.id,
      name: props.name,
      singers: deepCopy(props.singers),
      albumName: props.albumName,
      albumId: props.albumId,
      index: props.number - 1,
      wasPrivate: props.isPrivate
    };
    uiStore.setCurrentEditingSong(song);
  };
  const onDelete = event => {
    event.stopPropagation();

    if (!userStore.isAuth || userStore.role !== 'ADMIN') {
      return uiStore.setErrorMessage('У вас нет прав администратора');
    }
    
    if (props.isPreview) {
      uploadStore.deleteFile(props.number - 1);
    } else {
      fetchDeleteSong();
    }
  };
  const audioClickHandler = () => {
    if (props.isPreview) return;
    if (audioStore.currentPlaying.audio.src.slice(-41) === props.fileName || audioStore.currentPlaying.audio.src.slice(-40) === props.fileName) {
      if (audioStore.currentPlaying.audio.paused) {
        setIsPlaying(true);
        audioStore.setCurrentPlaying({});
        audioStore.currentPlaying.audio.play();
      } else {
        setIsPlaying(false);
        audioStore.setCurrentPlaying({});
        audioStore.currentPlaying.audio.pause();
      }
    } else {
      audioStore.setCurrentQueue(deepCopy(audioStore.availableQueue));
      audioStore.setCurrentPlaying({
        id: props.id,
        name: props.name,
        singers: deepCopy(props.singers),
        albumName: props.albumName,
        albumId: props.albumId,
        index: props.number - 1,
        fileName: props.fileName,
        format: props.format,
        albumImage: props.albumImage,
        duration: props.duration,
        isFavourite: props.isFavourite,
        isPrivate: props.isPrivate
      });
      audioStore.currentPlaying.audio.play();
    }
  };

  useEffect(() => {
    if (!props.isPreview) {
      if (audioStore.currentPlaying.fileName === props.fileName) {
        if (audioStore.currentPlaying.audio.paused) {
          setIsClicked(true);
          setIsPlaying(false);
        } else {
          setIsClicked(true);
          setIsPlaying(true);
        }
      } else {
        setIsClicked(false);
        setIsPlaying(false);
      }
    }
  }, [audioStore.currentPlaying.fileName, audioStore.currentPlaying.audio.paused]);

  return (
    <AudioItemMarkupRow
      isPlaying={isPlaying}
      isClicked={isClicked}
      clickHandler={audioClickHandler}
      onEdit={onEdit}
      onDelete={onDelete}
      {...props}
    />
  );
});

export default AudioItem;