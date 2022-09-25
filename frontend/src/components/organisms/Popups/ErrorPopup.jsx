import { uiStore } from '../../../stores/UIStore';
import { observer } from 'mobx-react-lite';
import MessagePopup from './../../molucules/Popups/MessagePopup/MessagePopup';

const ErrorPopup = observer(() => {
  const clearMessage = () => uiStore.setErrorMessage('');  

  return (
    <MessagePopup 
      message={uiStore.errorMessage}
      type='error' 
      clearMessage={clearMessage}
    />
  );
});

export default ErrorPopup;