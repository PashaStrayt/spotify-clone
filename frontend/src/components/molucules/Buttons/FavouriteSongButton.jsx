import { RestAPI } from '../../../shared/workingWithFetch';
import IconButton from '../../atoms/Buttons/IconButton/IconButton';
import { useFetching } from '../../../hooks/useFetching';
import { audioStore } from '../../../stores/AudioStore';

const FavouriteSongButton = ({ songData, isClicked }) => {
  const fetchFavourite = useFetching(async () => {
    const { statusCode, response } = await RestAPI.changeSongFavourite(songData);

    if (statusCode === 200) {
      audioStore.changeSong({ id: songData.songId, isFavourite: response.isFavourite });
    }
  });

  const clickHandler = event => {
    event.stopPropagation();

    if (songData.isPreview) return;

    fetchFavourite();
  }

  return (
    <IconButton
      name='favourite-song'
      clickHandler={clickHandler}
      isClicked={isClicked}
    />
  );
};

export default FavouriteSongButton;