import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/UI/Header/Header';
import UploadSongs from '../../components/AddContent/UploadSongs/UploadSongs';
import Album from '../../components/AddContent/Album';
import Playlist from '../../components/AddContent/Playlist';
import Singer from '../../components/AddContent/Singer';
import style from './AdminPanel.module.scss';
import Button from '../../components/UI/Button/Button';

const buttons = [
  {
    path: '/admin-panel/songs',
    children: 'Треки'
  },
  {
    path: '/admin-panel/album',
    children: 'Альбом'
  },
  {
    path: '/admin-panel/playlist',
    children: 'Плейлист'
  },
  {
    path: '/admin-panel/singer',
    children: 'Исполнителя'
  },
];

const AdminPanel = () => {
  const [content, setContent] = useState();
  const { pathname: path } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    switch (path) {
      case '/admin-panel/songs':
        setContent(<UploadSongs />);
        break;
      case '/admin-panel/album':
        setContent(<Album />);
        break;
      case '/admin-panel/playlist':
        setContent(<Playlist />);
        break;
      case '/admin-panel/singer':
        setContent(<Singer />);
        break;
      default:
        break;
    }
  }, [path])

  return (
    <div>
      <header className={style.header}>
        <Header className='secondary'>Панель администратора</Header>
        <p className={style['header__text']}>Добавить</p>
        {
          buttons.map(button =>
            <Button
              className={path === button.path ? 'simple-green' : 'simple-transparent'}
              additionalStyle={{ width: 'auto' }}
              clickHandler={() => navigate(button.path)}
              key={button.path}
            >
              {button.children}
            </Button>
          )
        }
      </header>
      {content}
    </div>
  );
};

export default AdminPanel;