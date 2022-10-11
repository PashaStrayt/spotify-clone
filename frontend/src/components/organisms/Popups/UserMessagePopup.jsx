import { uiStore } from '../../../stores/UIStore';
import { observer } from 'mobx-react-lite';
import MessagePopup from '../../molucules/Popups/MessagePopup/MessagePopup';
import { useCallback } from 'react';

const UserMessagePopup = observer(() => {
  const clearMessage = useCallback(() => uiStore.setUserMessage(''), []);  

  return (
    <MessagePopup 
      message={uiStore.userMessage}
      type='message' 
      clearMessage={clearMessage}
    />
  );
});

export default UserMessagePopup;