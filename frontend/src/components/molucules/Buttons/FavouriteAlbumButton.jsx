import { RestAPI } from '../../../shared/workingWithFetch';
import IconButton from '../../atoms/Buttons/IconButton/IconButton';
import { useFetching } from '../../../hooks/useFetching';

const FavouriteAlbumButton = ({ initialIsClicked, albumId }) => {
  const fetchFavourite = useFetching(async () => {
    await RestAPI.changeAlbumFavourite({ albumId });
  });
  return (
    <IconButton
      name='favourite-album'
      isClicked={initialIsClicked}
      clickHandler={fetchFavourite}
    />
  );
};

export default FavouriteAlbumButton;