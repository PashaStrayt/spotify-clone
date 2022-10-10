import Input from '../../../atoms/Inputs/Input/Input';
import Image from '../../../atoms/Image/Image';
import styles from './styles.module.scss';

const SearchInput = ({ value, changeHandler, keyDownHandler }) => {
  return (
    <div className={styles.container}>
      <Image
        type='icon'
        size='small'
        src='/search-dark-icon.svg'
        alt='Search icon'
        additionalStyle={{ position: 'absolute', inset: '12px' }}
      />
      <Input
        className='search'
        value={value}
        placeholder='Чтобы что-то найти, нужно что-то найти (с) Волк'
        changeHandler={changeHandler}
        keyDownHandler={keyDownHandler}
      />
    </div>
  );
};

export default SearchInput;