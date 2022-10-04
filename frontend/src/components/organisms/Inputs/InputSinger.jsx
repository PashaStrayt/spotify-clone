import InputWithAdvices from '../../molucules/Inputs/InputWithAdvices/InputWithAdvices';
import Button from '../../atoms/Buttons/Button/Button';
import { AudioAPI } from '../../../shared/AudioAPI';

const InputSinger = ({ singers, setData, addOneEmtySinger }) => {
  return (
    <>
      {
        AudioAPI.makeSingersArray(singers) &&
        AudioAPI.makeSingersArray(singers)?.map(({ name }, index) =>
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