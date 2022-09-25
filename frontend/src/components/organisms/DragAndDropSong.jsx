import DragAndDrop from '../molucules/DragAndDrop/DragAndDrop';
import { AudioAPI } from './../../shared/AudioAPI';
import { uploadStore } from './../../stores/UploadStore';

const DragAndDropSong = () => {
  const onLoadFiles = files => {
    files.forEach(file => {
      if (!AudioAPI.isItAcceptedExtension(file.type)) {
        return;
      }

      uploadStore.pushFiles({
        name: file.name.slice(0, -4) || 'Без названия',
        format: AudioAPI.makeValidExtension(file.name),
        albumName: 'Без альбома',
        albumImage: 'album-image.svg',
        singers: { 0: { id: null, name: 'Не известен' } },
        duration: '—',
        albumId: null
      }, file);
    });
  };

  return (
    <DragAndDrop
      upFiles={onLoadFiles}
      accept='audio/wav,audio/mp3,audio/ogg,audio/m4a,audio/flac'
    />
  );
};

export default DragAndDropSong;