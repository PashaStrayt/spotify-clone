import styles from './styles.module.scss';
import SearchAdvice from '../../SearchAdvice/SearchAdvice';
import { useState } from 'react';
import { RestAPI } from '../../../../shared/workingWithFetch';
import Input from './../../../atoms/Inputs/Input/Input';

const InputWithAdvices = ({ index, searchMethod, name, placeholder, setData }) => {
  const [searchResult, setSearchResult] = useState(null);

  const inputChangeHandler = async event => {
    const name = event.target.value;
    setData(index, { id: null, name });
    if (!name) {
      setSearchResult(null);
      return;
    }
    const { response } = await RestAPI.searchForAdvices({
      searchMethod, searchQuery: name
    });
    setSearchResult(response);
  };
  const adviceClickHandler = ({ id, name }) => {
    setSearchResult(null);
    setData(index, { id, name });
  };

  return (
    <div className={styles.container}>
      <Input
        className='simple'
        value={name}
        placeholder={placeholder}
        changeHandler={inputChangeHandler}
      />
      {
        searchResult ?
          searchResult?.map(advice =>
            <SearchAdvice
              id={advice.id}
              name={advice.name}
              upAdviceData={adviceClickHandler}
              key={advice.name + advice.id}
            />
          ) :
          ''
      }
    </div>
  );
};

export default InputWithAdvices;