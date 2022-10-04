import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HomeAlbums from '../templates/Home/HomeAlbums';
import HomeMain from '../templates/Home/HomeMain';

const Home = () => {
  const location = useLocation();
  const [content, setContent] = useState(<HomeMain />)

  useEffect(() => {
    switch (location.pathname) {
      case '/home/albums':
        setContent(<HomeAlbums />)
        break;
      case '/home':
        setContent(<HomeMain />)
        break;
      default:
        break;
    }
  }, [location.pathname]);

  return (
    <div className="wrapper" style={{ paddingTop: '20px' }}>
      {content}
    </div>
  );
};

export default Home;