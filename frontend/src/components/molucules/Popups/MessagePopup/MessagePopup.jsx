import styles from './styles.module.scss';
import className from 'classnames';
import OverlayingPopup from '../../../atoms/OverlayingPopup/OverlayingPopup';

const MessagePopup = ({ message, type, clearMessage }) => {
  return (
    <OverlayingPopup isOpened={message} onClose={clearMessage} isBackground={false}>
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