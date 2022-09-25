import OverlayingPopup from './../../../atoms/OverlayingPopup/OverlayingPopup';
import FormWithButtons from './../../FormWithButtons/FormWithButtons';

const FormPopup = ({ children, isOpened, onSave, onClose }) => {
  return (
    <OverlayingPopup isOpened={isOpened} onClose={onClose}>
      <FormWithButtons type='popup' onSave={onSave} onCancel={onClose}>
        {children}
      </FormWithButtons>
    </OverlayingPopup>
  );
};

export default FormPopup;