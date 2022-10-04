import { RestAPI } from '../../../shared/workingWithFetch';
import IconButton from '../../atoms/Buttons/IconButton/IconButton';
import { useFetching } from '../../../hooks/useFetching';

const FavouritePlaylistButton = ({ initialIsClicked, playlistId }) => {
  const fetchFavourite = useFetching(async () => {
    await RestAPI.changePlaylistFavourite({ playlistId });
  });

  return (
    <IconButton
      name='favourite-playlist'
      initialIsClicked={initialIsClicked}
      clickHandler={fetchFavourite}
    />
  );
};

export default FavouritePlaylistButton;