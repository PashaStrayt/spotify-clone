import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './../molucules/Header/Header';
import AudioList from './../templates/AudioList';
import { audioStore } from './../../stores/AudioStore';
import { observer } from 'mobx-react-lite';
import AlbumList from './../organisms/AlbumList/AlbumList';

const initialButtons = [
  {
    isClicked: false,
    path: '/favourite/songs',
    children: 'Треки'
  },
  {
    isClicked: false,
    path: '/favourite/albums',
    children: 'Альбомы'
  }
];

const Favourite = observer(() => {
  const location = useLocation();
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
      case '/favourite/songs':
        setContent(
          <AudioList isPreview={false} audios={audioStore.availableQueue.queue} />
        );
        break;
      case '/favourite/albums':
        setContent(
          <AlbumList isExpanded={true} />
        );
        break;
      default:
        break;
    }
  }, [location.pathname]);

  return (
    <>
      <Header
        headingText='Моя музыка'
        selectPanelText='Слушать'
        buttons={buttons}
      />
      <div className="wrapper">
        {content}
      </div>
    </>
  );
});

export default Favourite;