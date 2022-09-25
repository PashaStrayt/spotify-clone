import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './../molucules/Header/Header';
import CreateAlbum from './../templates/AdminPanel/CreateAlbum';
import CreatePlaylist from './../templates/AdminPanel/CreatePlaylist';
import CreateSinger from './../templates/AdminPanel/CreateSinger';
import UploadSongs from './../templates/AdminPanel/UploadSongs';

const initialButtons = [
  {
    isClicked: false,
    path: '/admin-panel/songs',
    children: 'Треки'
  },
  {
    isClicked: false,
    path: '/admin-panel/album',
    children: 'Альбом'
  },
  {
    isClicked: false,
    path: '/admin-panel/playlist',
    children: 'Плейлист'
  },
  {
    isClicked: false,
    path: '/admin-panel/singer',
    children: 'Исполнителя'
  },
];

const AdminPanel = () => {
  const location= useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState();
  const [buttons, setButtons] = useState(initialButtons.map(button => {
    const { isClicked, children, path } = button;
    return {
      isClicked,
      path,
      children,
      clickHandler: () => {
        navigate(path)
      }
    };
  }));

  useEffect(() => {
    setButtons(prev => prev.map(button => {
      return {
        ...button,
        isClicked: location.pathname === button.path
      }
    }));

    switch (location.pathname) {
      case '/admin-panel/songs':
        setContent(<UploadSongs />)
        break;
      case '/admin-panel/album':
        setContent(<CreateAlbum />)
        break;
      case '/admin-panel/playlist':
        setContent(<CreatePlaylist />)
        break;
      case '/admin-panel/singer':
        setContent(<CreateSinger />)
        break;
      default:
        break;
    }
  }, [location.pathname]);

  return (
    <>
      <Header
        headingText='Панель администратора'
        selectPanelText='Добавить'
        buttons={buttons}
      />
      {content}
    </>
  );
};

export default AdminPanel;