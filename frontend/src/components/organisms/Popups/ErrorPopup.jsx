import { uiStore } from '../../../stores/UIStore';
import { observer } from 'mobx-react-lite';
import MessagePopup from './../../molucules/Popups/MessagePopup/MessagePopup';
import { useCallback } from 'react';

const ErrorPopup = observer(() => {
  const clearMessage = useCallback(() => uiStore.setErrorMessage(''), []);  

  return (
    <MessagePopup 
      message={uiStore.errorMessage}
      type='error' 
      clearMessage={clearMessage}
    />
  );
});

export default ErrorPopup;