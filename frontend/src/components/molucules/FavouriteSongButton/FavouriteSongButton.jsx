import { RestAPI } from '../../../shared/workingWithFetch';
import IconButton from '../../atoms/Buttons/IconButton/IconButton';
import { useFetching } from './../../../hooks/useFetching';

const FavouriteSongButton = ({ initialIsClicked, songData }) => {
  const fetchFavourite = useFetching(async () => {
    await RestAPI.changeSongFavourite(songData);
  });

  const clickHandler = event => {
    event.stopPropagation();

    if (songData.isPreview) return;

    fetchFavourite();
  }

  return (
    <IconButton
      name='favourite-song'
      initialIsClicked={initialIsClicked}
      clickHandler={clickHandler}
    />
  );
};

export default FavouriteSongButton;