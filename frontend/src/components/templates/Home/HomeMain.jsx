import Heading from '../../atoms/Heading/Heading';
import AlbumList from '../../organisms/AlbumList/AlbumList';
import HeadingWithLink from './../../molucules/HeadingWithLink/HeadingWithLink';
import AudioList from './../AudioList';
import { audioStore } from './../../../stores/AudioStore';
import { observer } from 'mobx-react-lite';

const HomeMain = observer(() => {
  return (
    <>
      <HeadingWithLink
        headingText='Новые альбомы'
        linkText='СМОТРЕТЬ ВСЕ'
        linkPath='/home/albums'
      />
      <AlbumList isExpanded={false} />

      <Heading level={2} additionalStyle={{ marginBottom: '26px' }}>
        Новые треки
      </Heading>
      <AudioList isPreview={false} audios={audioStore.availableQueue.queue} />
    </>
  );
});

export default HomeMain;