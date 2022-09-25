import ContextPopup from "../../molucules/Popups/ContextPopup/ContextPopup";
import LinkWithIcon from './../../atoms/Links/LinkWithIcon/LinkWithIcon';
import { updateUserStoreAndCookies } from './../../../shared/workingWithAuthentication';

const LinksPopup = ({ isOpened, onClose }) => {
  return (
    <ContextPopup type='links' isBackground={false} isOpened={isOpened} onClose={onClose}>
      <LinkWithIcon
        name='sign-out'
        isBackground={true}
        clickHandler={() => {
          updateUserStoreAndCookies({
            isAuth: false,
            token: ''
          });
          onClose();
        }}
      />
      <LinkWithIcon
        name='user-settings'
        isBackground={true}
      />
    </ContextPopup>
  );
};

export default LinksPopup;