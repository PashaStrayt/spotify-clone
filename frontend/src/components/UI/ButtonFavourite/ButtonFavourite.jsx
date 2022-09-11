import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import Button from '../Button/Button';
import style from './ButtonFavourite.module.scss';

const ButtonFavourite = observer(({ size, additionalStyle, clickHandler, ...props }) => {
  const urlOfImage = '/favourite-image.svg';
  const urlOfActiveImage = '/favourite-active-image.svg';

  const [styleState, setStyleState] = useState(additionalStyle);
  const [stateUrlOfImage, setStateUrlOfImage] = useState();
  const [isActive, setIsActive] = useState(props.isActive);

  const mouseOverHandler = () => {
    if (isActive) {
      setStateUrlOfImage(urlOfActiveImage);
    } else {
      setStateUrlOfImage(urlOfActiveImage);
    }

    setStyleState({ ...additionalStyle, opacity: 1 })
  };
  const mouseOutHandler = () => {
    if (isActive) {
      setStateUrlOfImage(urlOfActiveImage);
    } else {
      setStateUrlOfImage(urlOfImage);
    }

    setStyleState(additionalStyle)
  };

  useEffect(() => {
    setStateUrlOfImage(isActive ? urlOfActiveImage : urlOfImage)
  }, [isActive])

  return (
    <Button
      className={'only-icon--' + size}
      additionalStyle={styleState}
      title='Добавить / удалить из избранного'
      clickHandler={() => {
        if (isActive) {
          mouseOverHandler();
        } else {
          mouseOutHandler();
        }
        setIsActive(!isActive);
        clickHandler();
      }}
      onMouseOver={mouseOverHandler}
      onMouseOut={mouseOutHandler}
    >
      <img src={stateUrlOfImage} alt="Icon" className={style.icon} />
    </Button>
  );
});

export default ButtonFavourite;