import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { checkAuth } from '../../API/checkAuth';
import { userStore } from '../../store/UserStore';
import style from './NavBar.module.scss';
import ButtonIcon from '../UI/ButtonIcon/ButtonIcon';
import LinkWithIcon from '../UI/LinkWithIcon/LinkWithIcon';

const NavBar = observer(() => {
  const links = [
    { name: 'home' },
    { name: 'search' },
    { name: 'favourite' },
    { name: 'admin-panel', additonalStyle: { margin: '28px 0 48px' } }
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className={style.wrapper}>
      <nav className={style['nav-bar']}>
        {
          !userStore.isAuth ?
            <div className={style.user}>
              <img className={style.user__avatar} src={'/' + userStore.image} alt="Аватар" />
              <p className={style.user__login}>{userStore.login}</p>
              <ButtonIcon buttonName='user-settings' additionalStyle={{ height: '10px' }} />
            </div> :
            <div className={style.user} style={{gap: '28px'}}>
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
      </nav>
    </div>
  )
});

export default NavBar;