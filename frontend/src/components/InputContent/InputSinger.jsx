import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import style from './InputContent.module.scss';

const InputSinger = observer(({ singers, value, index, adviceClickHandler, addMoreClickHandler, additionalStyle }) => {
  const [searchResult, setSearchResult] = useState(null);

  const changeHandler = async event => {
    const singerName = event.target.value;
    adviceClickHandler(index, { id: null, name: singerName });
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
    adviceClickHandler(index, { id: singerId, name: singerName });
  };

  return (
    <div className={style.container} style={additionalStyle}>
      <Input
        className='in-adding-content'
        value={value}
        placeholder='Название группы или исполнитель'
        onChange={changeHandler}
      />
      {
        searchResult ?
          searchResult?.map(singer =>
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
        !singers[index + 1] &&
        <Button
          additionalStyle={{ maxWidth: '216px', marginBottom: '6px' }}
          className='simple-transparent'
          clickHandler={addMoreClickHandler}
        >
          Добавить еще
        </Button>
      }
    </div>
  );
});

export default InputSinger;