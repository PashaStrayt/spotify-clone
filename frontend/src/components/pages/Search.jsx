import SearchHeader from './../organisms/SearchHeader';
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AlbumList from './../organisms/AlbumList/AlbumList';
import { uiStore } from './../../stores/UIStore';
import SearchSongs from '../templates/Search/SearchSongs';
import { observer } from 'mobx-react-lite';
import { useFetching } from './../../hooks/useFetching';
import { audioStore } from './../../stores/AudioStore';
import { AudioAPI } from './../../shared/AudioAPI';
import { RestAPI } from './../../shared/workingWithFetch';

const Search = observer(() => {
  const location = useLocation();
  const [content, setContent] = useState();

  const search = useFetching(async () => {
    if (!uiStore.searchQuery) {
      return;
    }

    if (location.pathname === '/search/songs') {
      let { headers, response } = await RestAPI.searchSongs({
        page: audioStore.availableQueue.page,
        searchQuery: uiStore.searchQuery
      });
      audioStore.setAvailableQueue({ totalPages: headers.totalPages });

      if (Array.isArray(response) && response.length) {
        response = await AudioAPI.makeSongsArray(response);
        audioStore.setAvailableQueue({ queue: response });
      }
    }

    else if (location.pathname === '/search/albums') {
      const { statusCode, response, headers } = await RestAPI.searchAlbums({
        page: audioStore.albums.page,
        searchQuery: uiStore.searchQuery
      });

      if (statusCode === 200 && Array.isArray(response) && response.length) {
        audioStore.setAlbums({ totalPages: headers.totalPages });
        audioStore.setAlbums({ list: response });
      }
    }
  });

  const inputChangeHandler = event => {
    uiStore.setSearchQuery(event.target.value);
  };

  const keyDownHandler = event => {
    if (event.keyCode === 13) {
      search();
    }
  }

  useEffect(() => {
    switch (location.pathname) {
      case '/search/songs':
        setContent(
          <SearchSongs />
        );
        break;
      case '/search/albums':
        setContent(
          <AlbumList isExpanded={true} />
        );
        break;
      default:
        break;
    }
  }, [location.pathname]);

  return (
    <>
      <SearchHeader
        value={uiStore.searchQuery}
        changeHandler={inputChangeHandler}
        keyDownHandler={keyDownHandler}
      />
      <div className="wrapper">
        {content}
      </div>
    </>
  );
});

export default Search;