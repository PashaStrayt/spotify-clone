import Input from '../Input/Input';
import style from './InputPassword.module.scss';
import ButtonIcon from '../ButtonIcon/ButtonIcon';
import { useState } from 'react';
import ButtonPassword from '../ButtonPassword/ButtonPassword';

const InputPassword = (props) => {
  const [type, setType] = useState('password');

  return (
    <div className={style.container}>
      <Input
        className='in-registration'
        type={type}
        {...props}
      />
      <ButtonPassword
        additionalStyle={{ position: 'absolute', right: '12px', top: '13px', margin: 0 }}
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