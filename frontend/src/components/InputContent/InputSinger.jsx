import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { uiStore } from '../../store/UIStore';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import style from './InputContent.module.scss';

const InputSinger = observer(() => {
  const [searchResult, setSearchResult] = useState(null);

  const changeHandler = async event => {
    const singerName = event.target.value;
    uiStore.setCurrentEditingSong({ ...uiStore.currentEditingSong, singerName, singerId: null });
    if (!singerName) {
      setSearchResult(null);
      return;
    }
    const url = new URL('http://localhost:3000/api/search/simple');
    url.searchParams.append('searchMethod', 'singer');
    url.searchParams.append('searchQuery', singerName);

    let singers = await fetch(url);
    singers = await singers.json();
    setSearchResult(singers);
  };
  const clickHandler = event => {
    setSearchResult(null);
    const singerName = event.target.innerHTML;
    const singerId = event.target.getAttribute('data-id');
    uiStore.setCurrentEditingSong({ ...uiStore.currentEditingSong, singerName, singerId });
  };

  return (
    <div className={style.container}>
      <Input
        className='in-adding-content'
        value={uiStore.currentEditingSong.singerName}
        placeholder='Название группы или исполнитель'
        onChange={changeHandler}
      />
      {
        searchResult ?
          searchResult.map(singer =>
            <Button
              className='search-advice'
              clickHandler={clickHandler}
              data-id={singer.id}
              key={singer.name + singer.id}
            >
              {singer.name}
            </Button>
          ) :
          ''
      }
    </div>
  );
});

export default InputSinger;