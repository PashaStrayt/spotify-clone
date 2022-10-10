import AudioList from './../AudioList';
import { audioStore } from './../../../stores/AudioStore';
import { observer } from 'mobx-react-lite';

const SearchSongs = observer(() => {
  return (
    <AudioList isPreview={false} audios={audioStore.availableQueue.queue} />
  );
});

export default SearchSongs;