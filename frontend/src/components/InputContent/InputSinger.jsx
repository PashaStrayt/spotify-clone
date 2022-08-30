import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { uiStore } from '../../store/UIStore';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import style from './InputContent.module.scss';

const InputSinger = observer(({ index }) => {
  const [searchResult, setSearchResult] = useState(null);

  const changeHandler = async event => {
    const singerName = event.target.value;
    uiStore.setSingerIdAndNameByIndex(index, { id: null, name: singerName });
    if (!singerName) {
      setSearchResult(null);
      return;
    }
    const url = encodeURI('/api/search/simple?searchMethod=singer&searchQuery=' + singerName);
    let singers = await fetch(url);
    singers = await singers.json();
    setSearchResult(singers);
  };
  const clickHandler = event => {
    setSearchResult(null);
    const singerName = event.target.innerHTML;
    const singerId = event.target.getAttribute('data-id');
    uiStore.setSingerIdAndNameByIndex(index, { id: singerId, name: singerName });
  };

  return (
    <div className={style.container}>
      <Input
        className='in-adding-content'
        value={uiStore.currentEditingSong.singers[index].name}
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
      {
        !uiStore.currentEditingSong.singers[index + 1] &&
        <Button
          additionalStyle={{ maxWidth: '216px', marginBottom: '6px' }}
          className='simple-transparent'
          clickHandler={() => {
            uiStore.setSingerIdAndNameByIndex(index + 1, { id: null, name: 'Не известен' })
          }}
        >
          Добавить еще
        </Button>
      }
    </div>
  );
});

export default InputSinger;