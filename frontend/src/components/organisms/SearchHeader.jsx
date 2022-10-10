import Header from "../molucules/Header/Header";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SearchInput from '../molucules/Inputs/SearchInput/SearchInput';

const initialButtons = [
  {
    isClicked: false,
    path: '/search/songs',
    children: 'Трек'
  },
  {
    isClicked: false,
    path: '/search/albums',
    children: 'Альбом'
  }
];

const SearchHeader = ({ value, changeHandler, keyDownHandler }) => {
  const location = useLocation();
  const navigate = useNavigate();
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
  }, [location.pathname]);

  return (
    <Header headingText='' selectPanelText='Поиск по' buttons={buttons}>
      <SearchInput value={value} changeHandler={changeHandler} keyDownHandler={keyDownHandler} />
    </Header>
  );
};

export default SearchHeader;