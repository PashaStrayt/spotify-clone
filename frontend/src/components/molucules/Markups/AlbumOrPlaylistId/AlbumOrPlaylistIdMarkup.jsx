import style from './styles.module.scss';
import AudioList from '../../../templates/AudioList';
import { observer } from 'mobx-react-lite';
import UploadImage from '../../UploadImage/UploadImage';
import Heading from '../../../atoms/Heading/Heading';
import IconButton from '../../../atoms/Buttons/IconButton/IconButton';
import FavouriteAlbumButton from '../../Buttons/FavouriteAlbumButton';
import FavouritePlaylistButton from '../../Buttons/FavouritePlaylistButton';
import UploadSongs from '../../../templates/AdminPanel/UploadSongs';
import { AudioAPI } from '../../../../shared/AudioAPI';

const AlbumOrPlaylistId = observer(({
  type,
  id,
  name,
  singers,
  imageFileName,
  date,
  isFavourite,
  songsAmount,
  totalDuration,
  audios,
  isUploadMenuOpened,
  onPlay,
  onEdit,
  onUpload,
  onDelete,
  onHideUploadMenu
}) => {
  return (
    <div className={style.container}>
      <header className={style.header}>
        <UploadImage
          contentId={id}
          isPreview={false}
          type='album'
          size='big'
          initialFileName={imageFileName}
        />
        <div className={style['header__content-info']}>
          {
            type === 'album' ?
              <p className={style['content-info__type']}>
                альбом, {date}
              </p> :
              <p className={style['content-info__type']}>
                плейлист
              </p>
          }
          <Heading level={1}>{name}</Heading>
          <p className={style['content-info__singers']}>{AudioAPI.makeSingerNames(singers)}</p>
          <p className={style['content-info__duration']}>
            {songsAmount} songs, {totalDuration}
          </p>
        </div>
      </header>
      <div className={style.plate}>
        <div className={style.plate__buttons}>
          <IconButton
            name='play-album'
            additionalStyle={{ marginRight: '16px' }}
            clickHandler={onPlay}
          />
          {
            type === 'album' ?
              <FavouriteAlbumButton
                initialIsClicked={isFavourite}
                albumId={id}
              /> :
              <FavouritePlaylistButton
                initialIsClicked='isFavourite'
              />
          }
          <IconButton
            name='edit-album'
            clickHandler={onEdit}
          />
          {
            type === 'album' &&
            <IconButton
              name='upload-songs'
              clickHandler={onUpload}
            />
          }
          <IconButton
            name='delete-album'
            clickHandler={onDelete}
          />
        </div>
        {
          type === 'album' && isUploadMenuOpened &&
          <UploadSongs
            albumName={name}
            albumImage={imageFileName}
            albumId={id}
            singers={AudioAPI.makeSingersObject(singers)}
            onHide={onHideUploadMenu}
          />
        }
        <div className={style.br} />
        {
          audios?.length > 0 &&
          <AudioList
            isPreview={false}
            audios={audios}
            currentAlbumId={type === 'album' ? id : null}
            playlistId={type === 'playlist' ? id : null}
          />
        }
      </div>
    </div>
  );
});

export default AlbumOrPlaylistId;