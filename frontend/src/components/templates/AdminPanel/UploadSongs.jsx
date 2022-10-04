import { observer } from "mobx-react-lite";
import { useFetching } from "../../../hooks/useFetching";
import LoadMoreOrSave from "../../molucules/LoadMoreOrSave/LoadMoreOrSave";
import { RestAPI } from "../../../shared/workingWithFetch";
import DragAndDropSong from './../../organisms/DragAndDropSong';
import { uploadStore } from './../../../stores/UploadStore';
import AudioList from './../AudioList';

const UploadSongs = observer(({ albumName, albumImage, albumId, singers, onHide }) => {
  const fetchSongs = useFetching(async () => {
    const { info, content } = uploadStore.files;
    const { statusCode } = await RestAPI.uploadSongs({ info, content });

    if (statusCode === 200) {
      uploadStore.setDefaultFiles();
      if (onHide) {
        onHide();
      }
    }
  });
  const onCancel = () => uploadStore.setDefaultFiles();
  return (
    <>
      <DragAndDropSong
        albumName={albumName}
        albumImage={albumImage}
        albumId={albumId}
        singers={singers}
      />
      {
        !!uploadStore.files?.info?.length &&
        <LoadMoreOrSave
          onSave={fetchSongs}
          onCancel={onCancel}
        />
      }
      <AudioList isPreview={true} audios={uploadStore.files.info} />
    </>
  );
});

export default UploadSongs;