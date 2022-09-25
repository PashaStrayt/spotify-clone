import Button from './../../atoms/Buttons/Button/Button';

const SearchAdvice = ({ id, name, upAdviceData }) => {
  const clickHandler = event => {
    event.preventDefault();

    const id = event.target.getAttribute('data-id');
    const name = event.target.innerHTML;
    upAdviceData({ id, name });
  };

  return (
    <Button className='search-advice' data-id={id} clickHandler={clickHandler}>
      {name}
    </Button>
  );
};

export default SearchAdvice;