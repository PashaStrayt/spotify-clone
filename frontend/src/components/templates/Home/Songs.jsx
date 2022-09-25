import Heading from './../../atoms/Heading/Heading';
import { audioStore } from './../../../stores/AudioStore';
import AudioList from './../AudioList';
import { observer } from 'mobx-react-lite';

const Songs = observer(() => {
  return (
    <div>
      <Heading level={2} additionalStyle={{ marginBottom: '26px' }}>
        Новые треки
      </Heading>
      {
        audioStore.availableQueue.queue?.length > 0 &&
        <AudioList isPreview={false} audios={audioStore.availableQueue.queue} />
      }
    </div>
  );
});

export default Songs;