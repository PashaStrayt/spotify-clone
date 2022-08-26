import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Auth } from '../../API/Auth';
import { userStore } from '../../store/UserStore';
import style from './NavBar.module.scss';
import ButtonIcon from '../UI/ButtonIcon/ButtonIcon';
import LinkWithIcon from '../UI/LinkWithIcon/LinkWithIcon';
import ContextMenu from '../UI/ContextMenu/ContextMenu';
import { uiStore } from '../../store/UIStore';
import Input from '../UI/Input/Input';
import { useFetching } from '../../hooks/useFetching';
import { useState } from 'react';
import { useRef } from 'react';

const NavBar = observer(() => {
  const links = [
    { name: 'home' },
    { name: 'search' },
    { name: 'favourite' },
    { name: 'admin-panel', additonalStyle: { margin: '28px 0 48px' } }
  ];
  const [uploadAvatar, setUploadAvatar] = useState(null);
  const fetchAvatar = useFetching(async () => {
    const formData = new FormData();
    formData.append('id', userStore.userId);
    formData.append('image', uploadAvatar);
    formData.append('imageFileName', userStore.imageFileName);

    let response = await fetch('/api/user/update-avatar', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': 'bearer ' + userStore.token
      }
    });
  });

  useEffect(() => {
    Auth.checkAuth();
  }, []);
  useEffect(() => {
    if (uploadAvatar) {
      fetchAvatar();
    }
  }, [uploadAvatar]);

  return (
    <div className={style.wrapper}>
      <nav className={style['nav-bar']}>
        {
          userStore.isAuth === 'true' ?
            <div className={style.user}>
              <label className={style['user__avatar-block']}>
                <img
                  className={style['user__avatar-image']}
                  src={'/' + userStore.imageFileName}
                  alt="Аватар"
                />
                <Input
                  type='file'
                  className='file'
                  changeHandler={event => setUploadAvatar(event.target.files[0])}
                />
              </label>
              <p className={style.user__login}>{userStore.login}</p>
              <ButtonIcon
                buttonName='user-menu'
                additionalStyle={{ height: '10px' }}
              />
            </div> :
            <div className={style.user} style={{ gap: '28px' }}>
              <p className={style.user__advice}>Войдите в аккаунт,  чтобы использовать сервис на 100%</p>
              <LinkWithIcon linkName='registration' />
              <LinkWithIcon linkName='login' />
            </div>
        }
        <hr className={style.line} />
        <div className={style['links-block']}>
          {
            links.map(link =>
              <LinkWithIcon
                linkName={link.name}
                additionalStyle={link?.additonalStyle}
                key={link.name}
              />
            )
          }
        </div>
        {/* Временно. Для предпросмотра дизайна */}
        <div className={style['playlists-block']}>
          <a>Chill Mix</a>
          <a>Insta Hits</a>
          <a>Your Top Songs 2021</a>
        </div>
        {
          uiStore.whichButtonIconActive === 'user-menu' &&
          <ContextMenu>
            <LinkWithIcon
              linkName='sign-out'
              className='with-icon-and-background'
              clickHandler={() => {
                uiStore.setButtonIconActive('');
                userStore.setStateAndCookie('isAuth', false);
                userStore.setStateAndCookie('token', '');
              }}
            />
            <LinkWithIcon
              linkName='user-settings'
              className='with-icon-and-background'
              clickHandler={() => uiStore.setButtonIconActive('')}
            />
          </ContextMenu>
        }
      </nav>
    </div>
  )
});

export default NavBar;