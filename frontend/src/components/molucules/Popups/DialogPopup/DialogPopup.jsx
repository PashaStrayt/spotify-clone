import OverlayingPopup from '../../../atoms/OverlayingPopup/OverlayingPopup';
import Form from './../../../atoms/Form/Form';

const DialogPopup = ({ children, isOpened, onClose }) => {
  return (
    <OverlayingPopup isOpened={isOpened} onClose={onClose}>
      <Form type='popup'>
        {children}
      </Form>
    </OverlayingPopup>
  );
};

export default DialogPopup;