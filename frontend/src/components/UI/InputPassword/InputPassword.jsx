import Input from '../Input/Input';
import style from './Input.module.scss';
import ButtonIcon from '../ButtonIcon/ButtonIcon';
import { useState } from 'react';

const InputPassword = (props) => {
  const [type, setType] = useState('password');

  return (
    <div className={style.container}>
      <Input
        className='in-registration'
        type={type}
        {...props}
      />
      <ButtonIcon
        buttonName='password-visibility'
        clickHandler={() => {
          setType(
            type === 'password' ?
              'text' :
              'password'
          );
        }}
      />
    </div>
  );
};

export default InputPassword;