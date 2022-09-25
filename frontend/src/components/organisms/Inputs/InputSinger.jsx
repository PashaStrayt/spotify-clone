import InputWithAdvices from '../../molucules/Inputs/InputWithAdvices/InputWithAdvices';
import Button from '../../atoms/Buttons/Button/Button';

const InputSinger = ({ singers, setData, addOneEmtySinger }) => {

  return (
    <>
      {
        singers &&
        Object.entries(singers)?.map(([index, { name }]) =>
          <InputWithAdvices
            index={index}
            searchMethod='singer'
            name={name}
            placeholder='Название группы или имя'
            setData={setData}
            key={'input-with-advices-' + index}
          />
        )
      }

      <Button data-more='' isWidthAuto={true} className='transparent' clickHandler={addOneEmtySinger}>
        Добавить еще исполнителя
      </Button>
    </>
  );
};

export default InputSinger;