import styles from './styles.module.scss';
import OverlayingPopup from './../../../atoms/OverlayingPopup/OverlayingPopup';
import className from 'classnames';

const ContextPopup = ({ isBackground, type, children, isOpened, onClose }) => {
  return (
    <OverlayingPopup isBackground={isBackground} isOpened={isOpened} onClose={onClose}>
      <div className={className(styles.container, styles['container--' + type])}>
        {children}
      </div>
    </OverlayingPopup>
  );
};

export default ContextPopup;