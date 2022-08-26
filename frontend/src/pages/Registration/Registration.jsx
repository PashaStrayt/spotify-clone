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

const Registration = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    login: '',
    email: '',
    password1: '',
    password2: '',
    avatar: null,
    avatarFileName: ''
  });
  const fetchAvatar = useFetching(async () => {
    const formData = new FormData();
    formData.append('0', account.avatar);

    let avatarFileName = await fetch('/api/image/preview', {
      method: 'POST',
      body: formData
    });
    avatarFileName = await avatarFileName.json();
    setAccount({ ...account, avatarFileName });
  })
  const fetchForm = useFetching(async () => {
    const formData = new FormData();
    formData.append('login', account.login);
    formData.append('email', account.email);
    formData.append('password', account.password1);
    formData.append('image', account.avatar);

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

  const submit = event => {
    event.preventDefault();
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
  }

  useEffect(() => {
    if (account.avatar) {
      fetchAvatar();
    }
  }, [account.avatar]);

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
          autoComplete='email'
          changeHandler={event => setAccount({ ...account, email: event.target.value })}
        />
        <label>Пароль</label>
        <InputPassword
          placeholder='Пароль'
          value={account.password1}
          changeHandler={event => setAccount({ ...account, password1: event.target.value })}
        />
        <label>Повторите пароль</label>
        <InputPassword
          placeholder='Пароль'
          value={account.password2}
          changeHandler={event => setAccount({ ...account, password2: event.target.value })}
        />
        <label>Фотография профиля</label>
        <div className={style['upload-avatar']}>
          <label className={style['upload-avatar__label']}>
            {
              account.avatarFileName ?
                <img className={style['upload-avatar__avatar']} src={'/' + account.avatarFileName} alt="" /> :
                <img className={style['upload-avatar__plus']} src="/plus-icon.svg" alt="" />
            }
            <Input
              id='avatar'
              type='file'
              multiple
              accept='image/jpeg'
              className='file'
              changeHandler={event => {
                setAccount({ ...account, avatar: event.target.files[0] });
              }}
            />
          </label>
          <div className={style['upload-avatar__buttons-block']}>
            <Button
              className='simple-transparent'
              clickHandler={event => {
                event.preventDefault();
                setAccount({ ...account, avatar: null, avatarFileName: '' });
              }}
            >
              УДАЛИТЬ
            </Button>
            <label className={style['upload-avatar__button-label']} htmlFor='avatar'>
              ВЫБРАТЬ ДРУГУЮ
            </label>
          </div>
        </div>
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