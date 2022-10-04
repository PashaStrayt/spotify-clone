import styles from './styles.module.scss';
import { Portal } from 'react-portal';
import className from 'classnames';

const OverlayingPopup = ({ isBackground = true, children, isOpened, onClose }) => {
  if (!isOpened) {
    return null;
  }

  return (
    <Portal>
      <div className={styles.container}>
        <div
          className={className(styles.overlay, {
            [styles.background]: isBackground,
            [styles['overlay--opened']]: isOpened
          })}
          onClick={onClose}
        />
        {children}
      </div>
    </Portal>
  );
};

export default OverlayingPopup;