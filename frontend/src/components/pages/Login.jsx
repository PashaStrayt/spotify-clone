import Header from '../molucules/Header/Header';
import LoginForm from './../templates/LoginForm';

const Login = () => {
  return (
    <>
      <Header additionalStyle={{ margin: 0 }} headingText='Войти в аккаунт' alignHeading='center' />
      <div className='wrapper--login'>
        <LoginForm />
      </div>
    </>
  );
};

export default Login;