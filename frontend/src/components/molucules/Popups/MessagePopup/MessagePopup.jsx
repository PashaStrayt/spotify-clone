import styles from './styles.module.scss';
import className from 'classnames';
import OverlayingPopup from '../../../atoms/OverlayingPopup/OverlayingPopup';
import { useEffect } from 'react';
import { useRef } from 'react';

const MessagePopup = ({ message, type, clearMessage }) => {
  const timeout = useRef();

  useEffect(() => {
    clearTimeout(timeout.current);

    if (message) {
      timeout.current = setTimeout(clearMessage, 6000);
    }
  }, [message]);

  return (
    <OverlayingPopup isOverlay={false} isOpened={!!message} onClose={clearMessage} isBackground={false}>
      <p 
      className={className(styles.self, {
          [styles['self--error']]: type === 'error'
        })}
        >
        {message}
      </p>
    </OverlayingPopup>
  );
};

export default MessagePopup;