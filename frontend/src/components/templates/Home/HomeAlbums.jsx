import Heading from '../../atoms/Heading/Heading';
import AlbumList from '../../organisms/AlbumList/AlbumList';

const HomeAlbums = () => {
  return (
    <>
      <Heading level={2} additionalStyle={{ marginBottom: '26px' }}>
        Новые альбомы
      </Heading>
      <AlbumList isExpanded={true} />
    </>
  )
};

export default HomeAlbums;