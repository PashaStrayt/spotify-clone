import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import style from './NavBar.module.scss';
import UploadImage from '../../molucules/UploadImage/UploadImage';
import { userStore } from '../../../stores/UserStore';
import IconButton from '../../atoms/Buttons/IconButton/IconButton';
import LinkWithIcon from '../../atoms/Links/LinkWithIcon/LinkWithIcon';
import LinksPopup from '../Popups/LinksPopup';
import { useCallback } from 'react';
import Line from '../../atoms/Line/Line';
import {checkAuth} from '../../../shared/workingWithAuthentication'

const links = [
  { name: 'home' },
  { name: 'search' },
  { name: 'favourite' },
  { name: 'admin-panel', additonalStyle: { margin: '28px 0 48px' } }
];

const NavBar = observer(() => {
  const [isLinksPopupOpened, setIsLinksPopupOpened] = useState(false);

  const onCloseLinksPopup = useCallback(() => {
    setIsLinksPopupOpened(false);
  }, []);

  const onOpenLinksPopup = useCallback(() => {
    setIsLinksPopupOpened(true);
  }, []);


  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className={style.wrapper}>
      <nav className={style['nav-bar']}>
        {
          userStore.isAuth ?
            <div className={style.user}>
              <UploadImage
                type='avatar'
                isPreview={false}
                initialFileName={userStore?.imageFileName}
              />
              <p className={style.user__login}>{userStore.login}</p>
              <IconButton
                name='user-menu'
                additionalStyle={{ height: '10px' }}
                clickHandler={onOpenLinksPopup}
              />
              <LinksPopup
                isOpened={isLinksPopupOpened}
                onClose={onCloseLinksPopup}
              />
            </div> :
            <div className={style.user} style={{ gap: '28px' }}>
              <p className={style.user__advice}>Войдите в аккаунт, чтобы использовать сервис на 100%</p>
              <LinkWithIcon name='registration' />
              <LinkWithIcon name='login' />
            </div>
        }

        <Line className='nav-bar' />

        <div className={style['links-block']}>
          {
            links.map(link =>
              <LinkWithIcon
                name={link.name}
                additionalStyle={link?.additonalStyle}
                key={link.name}
              />
            )
          }
        </div>

        {/* Временно. Для предпросмотра дизайна */}
        <div className={style['playlists-block']}>
          <p href='#'>Chill Mix</p>
          <p href='#'>Insta Hits</p>
          <p href='#'>Your Top Songs 2021</p>
        </div>
      </nav>
    </div>
  )
});

export default NavBar;