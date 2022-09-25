import Label from './../atoms/Label/Label';
import Input from './../atoms/Inputs/Input/Input';
import InputPassword from '../molucules/Inputs/InputPassword/InputPassword';
import { useState } from 'react';
import UploadImage from './../molucules/UploadImage/UploadImage';
import { useFetching } from './../../hooks/useFetching';
import { uiStore } from './../../stores/UIStore';
import { isEmailValid } from '../../shared/workingWithTypes';
import { RestAPI } from '../../shared/workingWithFetch';
import { updateUserStoreAndCookies } from './../../shared/workingWithAuthentication';
import { useNavigate } from 'react-router-dom';
import FormWithButtons from './../molucules/FormWithButtons/FormWithButtons';

const isFormValid = ({ login, email, password, repeatedPassword }) => {
  if (!login) {
    uiStore.setErrorMessage('Введите логин');
    return false;
  }
  if (!isEmailValid(email)) {
    uiStore.setErrorMessage('Введите корректный email');
    return false;
  }
  if (!password) {
    uiStore.setErrorMessage('Введите пароль');
    return false;
  }
  if (!password === repeatedPassword) {
    uiStore.setErrorMessage('Пароли не совпадают');
    return false;
  }

  return true;
};

const getDefaultAccount = () => {
  return {
    login: '',
    email: '',
    password: '',
    repeatedPassword: '',
    avatar: { file: null, fileName: '' }
  };
};

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState(getDefaultAccount());

  const onCancel = () => {
    setAccount(getDefaultAccount());
  };
  const onSave = useFetching(async () => {
    if (!isFormValid(account)) {
      return;
    }

    const { response } = await RestAPI.register(account);

    if (response?.token) {
      updateUserStoreAndCookies({ ...response, isAuth: true });
      navigate('/home');
      onCancel();
    } else {
      uiStore.setErrorMessage(response.message);
    }
  });

  const loginInputHandler = event => {
    setAccount(prev => { return { ...prev, login: event.target.value } });
  };
  const emailInputHandler = event => {
    setAccount(prev => { return { ...prev, email: event.target.value } });
  };
  const passwordInputHandler = event => {
    setAccount(prev => { return { ...prev, password: event.target.value } });
  };
  const repeatedPasswordInputHandler = event => {
    setAccount(prev => { return { ...prev, repeatedPassword: event.target.value } });
  };
  const setImageInForm = ({ file, fileName }) => {
    setAccount(prev => { return { ...prev, avatar: { file, fileName } } });
  };

  return (
    <FormWithButtons type='registration' onSave={onSave} onCancel={onCancel}>
      <Label type="registration">Логин (будете видеть только вы)</Label>
      <Input
        className='registration'
        placeholder='Логин'
        value={account.login}
        changeHandler={loginInputHandler}
      />

      <Label type="registration">Электронная почта</Label>
      <Input
        className='registration'
        placeholder='Электронная почта'
        type='email'
        value={account.email}
        autoComplete='off'
        changeHandler={emailInputHandler}
      />

      <Label type="registration">Пароль</Label>
      <InputPassword
        value={account.password}
        placeholder='Пароль'
        autoComplete='off'
        changeHandler={passwordInputHandler}
      />

      <Label type="registration">Повторите пароль</Label>
      <InputPassword
        value={account.repeatedPassword}
        placeholder='Повторите пароль'
        autoComplete='off'
        changeHandler={repeatedPasswordInputHandler}
      />

      <Label type="registration">Фотография профиля</Label>
      <UploadImage
        isPreview={true}
        type='avatar'
        setImageInForm={setImageInForm}
      />
    </FormWithButtons>
  );
};

export default RegistrationForm;