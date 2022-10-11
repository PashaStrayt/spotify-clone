import ContextPopup from "../../molucules/Popups/ContextPopup/ContextPopup";
import LinkWithIcon from './../../atoms/Links/LinkWithIcon/LinkWithIcon';
import { updateUserStoreAndCookies } from './../../../shared/workingWithAuthentication';
import { useCallback } from 'react';

const LinksPopup = ({ isOpened, onClose }) => {
  const clickHandler = useCallback(() => {
    updateUserStoreAndCookies({
      isAuth: false,
      token: ''
    });
    onClose();
  }, []);

  return (
    <ContextPopup type='links' isBackground={false} isOpened={isOpened} onClose={onClose}>
      <LinkWithIcon
        name='sign-out'
        isBackground={true}
        clickHandler={clickHandler}
      />
      <LinkWithIcon
        name='user-settings'
        isBackground={true}
      />
    </ContextPopup>
  );
};

export default LinksPopup;