import style from './Home.module.scss';
import Header from '../../components/UI/Header/Header';
import AudioList from '../../components/AudioList/AudioList';
import { observer } from 'mobx-react-lite';
import { audioStore } from '../../store/AudioStore';
import Progress from '../../components/UI/Progress/Progress';

const Home = observer(() => {
  return (
    <div className={style.container}>
      <div className={style.songs}>
        <Header className='secondary'>Новые треки</Header>
        {
          audioStore.availableQueue.queue?.length > 0 &&
          <AudioList isPreview={false} audios={audioStore.availableQueue.queue} />
        }
      </div>
    </div>
  );
});

export default Home;