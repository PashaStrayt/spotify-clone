import Label from '../atoms/Label/Label';
import Input from '../atoms/Inputs/Input/Input';
import InputPassword from '../molucules/Inputs/InputPassword/InputPassword';
import { useState } from 'react';
import { useFetching } from '../../hooks/useFetching';
import { uiStore } from '../../stores/UIStore';
import { isEmailValid } from '../../shared/workingWithTypes';
import { RestAPI } from '../../shared/workingWithFetch';
import { updateUserStoreAndCookies } from '../../shared/workingWithAuthentication';
import { useNavigate } from 'react-router-dom';
import Button from './../atoms/Buttons/Button/Button';
import Form from './../atoms/Form/Form';
import LinkWithIcon from './../atoms/Links/LinkWithIcon/LinkWithIcon';

const isFormValid = ({ email, password }) => {
  if (!isEmailValid(email)) {
    uiStore.setErrorMessage('Введите корректный email');
    return false;
  }
  if (!password) {
    uiStore.setErrorMessage('Введите пароль');
    return false;
  }

  return true;
};

const getDefaultAccount = () => {
  return {
    email: '',
    password: ''
  };
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState(getDefaultAccount());

  const onSave = useFetching(async () => {
    if (!isFormValid(account)) {
      return;
    }

    const { response } = await RestAPI.login(account);

    if (response?.token) {
      updateUserStoreAndCookies({ ...response, isAuth: true });
      navigate('/home');
      setAccount(getDefaultAccount());
    } else {
      uiStore.setErrorMessage(response.message);
    }
  });

  const emailInputHandler = event => {
    setAccount(prev => { return { ...prev, email: event.target.value } });
  };
  const passwordInputHandler = event => {
    setAccount(prev => { return { ...prev, password: event.target.value } });
  };

  return (
    <Form type='registration'>
      <Label type="registration">Электронная почта</Label>
      <Input
        className='registration'
        placeholder='Электронная почта'
        type='email'
        value={account.email}
        autoComplete='email'
        changeHandler={emailInputHandler}
      />

      <Label type="registration">Пароль</Label>
      <InputPassword
        value={account.password}
        placeholder='Пароль'
        autoComplete='off'
        changeHandler={passwordInputHandler}
      />

      <Button className='green' clickHandler={onSave}>
        Войти
      </Button>
      <LinkWithIcon name='registration' />
    </Form>
  );
};

export default LoginForm;