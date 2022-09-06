import { useState } from 'react';
import { useFetching } from '../../hooks/useFetching'
import Button from '../../components/UI/Button/Button';
import Form from '../../components/UI/Form/Form';
import Input from '../../components/UI/Input/Input';
import InputPassword from '../../components/UI/InputPassword/InputPassword';
import LinkWithIcon from '../../components/UI/LinkWithIcon/LinkWithIcon';
import style from './Login.module.scss';
import { Auth } from '../../API/Auth';
import { useNavigate } from 'react-router-dom';
import { uiStore } from '../../store/UIStore';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fetchForm = useFetching(async () => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    let response = await fetch('/api/user/login', {
      method: 'POST',
      body: formData
    });
    response = await response.json();

    if (response?.token) {
      Auth.setStateAndCookie(response);
      navigate('/home');
      setEmail('');
      setPassword('');
    } else {
      uiStore.setErrorMessage(response.message)
    }
  });

  const submit = () => {
    if (Auth.validateEmail(email)) {
      fetchForm();
    } else {
      uiStore.setErrorMessage('Введите корректный email');
    }
  }

  return (
    <div className={style.container}>
      <Form className='registration'>
        <label>Электронная почта</label>
        <Input
          className='in-registration'
          placeholder='Электронная почта'
          type='email'
          value={email}
          autoComplete='email'
          changeHandler={event => setEmail(event.target.value)}
        />
        <label htmlFor="login__password">Пароль</label>
        <InputPassword
          placeholder='Пароль'
          value={password}
          changeHandler={event => setPassword(event.target.value)}
        />
        <Button
          className='simple-green'
          additionalStyle={{ maxWidth: '232px', width: '100%' }}
          type='submit'
          clickHandler={submit}
        >
          Войти
        </Button>
        <LinkWithIcon linkName='registration' />
      </Form>
    </div >
  );
};

export default Login;