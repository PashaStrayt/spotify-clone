import { useState } from 'react';
import { useFetching } from '../../hooks/useFetching'
import Button from '../../components/UI/Button/Button';
import Form from '../../components/UI/Form/Form';
import Input from '../../components/UI/Input/Input';
import InputPassword from '../../components/UI/InputPassword/InputPassword';
import style from './Registration.module.scss';
import { Auth } from '../../API/Auth';
import { useNavigate } from 'react-router-dom';
import { uiStore } from '../../store/UIStore';
import { useEffect } from 'react';
import UploadImage from '../../components/UI/UploadImage/UploadImage';

const Registration = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    login: '',
    email: '',
    password1: '',
    password2: '',
    avatar: { file: null, fileName: '' }
  });
  const setAvatar = async avatar => {
    setAccount({ ...account, avatar });
  };
  const fetchForm = useFetching(async () => {
    const formData = new FormData();
    formData.append('login', account.login);
    formData.append('email', account.email);
    formData.append('password', account.password1);
    formData.append('image', account.avatar.file);

    let response = await fetch('/api/user/registration', {
      method: 'POST',
      body: formData
    });
    response = await response.json();

    if (response?.token) {
      Auth.setStateAndCookie(response);
      navigate('/home');
    } else {
      uiStore.setErrorMessage(response.message)
    }
  });

  const submit = () => {
    if (account.login) {
      if (Auth.validateEmail(account.email)) {
        if (account.password1 === account.password2) {
          fetchForm();
        } else {
          uiStore.setErrorMessage('Пароли не совпадают');
        }
      } else {
        uiStore.setErrorMessage('Введите корректный email');
      }
    } else {
      uiStore.setErrorMessage('Введите логин');
    }
  };

  return (
    <div className={style.container}>
      <Form className='registration'>
        <label>Логин (будете видеть только вы)</label>
        <Input
          className='in-registration'
          placeholder='Логин'
          value={account.login}
          changeHandler={event => setAccount({ ...account, login: event.target.value })}
        />
        <label>Электронная почта</label>
        <Input
          className='in-registration'
          placeholder='Электронная почта'
          type='email'
          value={account.email}
          autoComplete='off'
          changeHandler={event => setAccount({ ...account, email: event.target.value })}
        />
        <label>Пароль</label>
        <InputPassword
          autoComplete='off'
          placeholder='Пароль'
          value={account.password1}
          changeHandler={event => setAccount({ ...account, password1: event.target.value })}
        />
        <label>Повторите пароль</label>
        <InputPassword
          autoComplete='off'
          placeholder='Пароль'
          value={account.password2}
          changeHandler={event => setAccount({ ...account, password2: event.target.value })}
        />
        <label>Фотография профиля</label>
        <UploadImage
          className='user-avatar'
          setImageInForm={setAvatar}
          clickHandler={() => {
            setAccount({ ...account, avatar: { file: null, fileName: '' } });
          }}
        />
        <Button
          className='simple-green'
          type='reset'
          additionalStyle={{ maxWidth: '232px', width: '100%' }}
          clickHandler={submit}
        >
          Готово
        </Button>
        <Button
          className='simple-transparent'
          type='reset'
          additionalStyle={{ maxWidth: '232px', width: '100%' }}
          clickHandler={() => navigate('/home')}
        >
          Отмена
        </Button>
      </Form>
    </div>
  );
};

export default Registration;