import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { uiStore } from '../../store/UIStore';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import style from './InputContent.module.scss';

const InputAlbum = observer(() => {
  const [searchResult, setSearchResult] = useState(null);

  const changeHandler = async event => {
    const albumName = event.target.value;
    uiStore.setCurrentEditingSong({ ...uiStore.currentEditingSong, albumName, albumId: null });
    if (!albumName) {
      setSearchResult(null);
      return;
    }
    const url = new URL('http:localhost:3000/api/search/simple');
    url.searchParams.append('searchMethod', 'album');
    url.searchParams.append('searchQuery', albumName);

    let albums = await fetch(url);
    albums = await albums.json();
    setSearchResult(albums);
  };
  const clickHandler = event => {
    setSearchResult(null);
    const albumName = event.target.innerHTML;
    const albumId = event.target.getAttribute('data-id');
    uiStore.setCurrentEditingSong({ ...uiStore.currentEditingSong, albumName, albumId });
  };

  return (
    <div className={style.container}>
      <Input
        className='in-adding-content'
        value={uiStore.currentEditingSong.albumName}
        placeholder='Название альбома'
        onChange={changeHandler}
      />
      {
        searchResult ?
          searchResult.map(album =>
            <Button
              className='search-advice'
              clickHandler={clickHandler}
              data-id={album.id}
              key={album.name + album.id}
            >
              {album.name}
            </Button>
          ) :
          ''
      }
    </div>
  );
});

export default InputAlbum;