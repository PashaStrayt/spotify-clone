import { observer } from 'mobx-react-lite';
import { uiStore } from '../../store/UIStore';
import ModalWindow from '../UI/ModalWindow/ModalWindow';
import Button from './Button/Button';

const ErrorWindow = observer(() => {
  return (
    <ModalWindow additionalStyle={{ gap: '24px', textAlign: 'center' }}>
      <p style={{ width: '100%' }}>Ошибка: {uiStore.errorMessage}</p>
      <Button
        className='simple-green'
        clickHandler={() => uiStore.setErrorMessage('')}
      >
        Закрыть
      </Button>
    </ModalWindow>
  );
});

export default ErrorWindow;