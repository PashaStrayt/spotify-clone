import styles from './styles.module.scss';
import { useState } from 'react';
import IconButton from '../../../atoms/Buttons/IconButton/IconButton';
import Input from '../../../atoms/Inputs/Input/Input';

const InputPassword = (props) => {
  const [type, setType] = useState('password');

  return (
    <div className={styles.container}>
      <Input
        className='registration'
        type={type}
        {...props}
      />
      <IconButton
        name='show-password'
        isApplyingHover={false}
        additionalStyle={{ position: 'absolute', right: '12px', top: '13px', margin: 0 }}
        clickHandler={event => {
          event.preventDefault();
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