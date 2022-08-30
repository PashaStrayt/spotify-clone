import style from './Home.module.scss';
import Header from '../../components/UI/Header/Header';
import AudioList from '../../components/AudioList/AudioList';
import { useState } from "react";
import { useFetching2 } from "../../hooks/useFetching";
import { makeSongsArray } from "../../API/audio";
import { userStore } from "../../store/UserStore";
import { observer } from 'mobx-react-lite';
import { audioStore } from '../../store/AudioStore';
import LoadingWheel from '../../components/UI/LoadingWheel/LoadingWheel'
import { useEffect } from 'react';

const Home = observer(() => {
  // console.log(audioStore.availableQueue.queue);
  return (
    <div className={style.container}>
      <div className={style.songs}>
        <Header className='secondary'>Новые треки</Header>
        {
          audioStore.availableQueue.queue?.length > 0 &&
          <AudioList isPreview={false} audios={audioStore.availableQueue.queue} />
        }
      </div>
      {/* {
        isLoading && <LoadingWheel />
      } */}
    </div>
  );
});

export default Home;