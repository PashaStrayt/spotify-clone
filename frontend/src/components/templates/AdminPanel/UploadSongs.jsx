import { observer } from "mobx-react-lite";
import { useFetching } from "../../../hooks/useFetching";
import LoadMoreOrSave from "../../molucules/LoadMoreOrSave/LoadMoreOrSave";
import { RestAPI } from "../../../shared/workingWithFetch";
import DragAndDropSong from './../../organisms/DragAndDropSong';
import { uploadStore } from './../../../stores/UploadStore';
import AudioList from './../AudioList';
import { useEffect } from 'react';

const UploadSongs = observer(() => {
  const fetchSongs = useFetching(async () => {
    const { info, content } = uploadStore.files;
    const { statusCode } = await RestAPI.uploadSongs({ info, content });

    if (statusCode === 200) {
      uploadStore.setDefaultFiles();
    }
  });
  const onCancel = () => uploadStore.setDefaultFiles();

  return (
    <div className="wrapper">
      <DragAndDropSong />
      {
        !!uploadStore.files?.info?.length &&
        <LoadMoreOrSave
          onSave={fetchSongs}
          onCancel={onCancel}
        />
      }
      <AudioList isPreview={true} audios={uploadStore.files.info} />
    </div>
  );
});

export default UploadSongs;