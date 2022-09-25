import InputWithAdvices from './../../molucules/Inputs/InputWithAdvices/InputWithAdvices';

const InputAlbum = ({ name, setData }) => {
  return (
    <InputWithAdvices
      searchMethod='album'
      name={name}
      placeholder='Название альбома'
      setData={setData}
    />
  );
};

export default InputAlbum;