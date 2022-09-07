import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import Button from '../Button/Button';
import style from './ButtonPassword.module.scss';

const ButtonPassword = observer(({ additionalStyle, clickHandler }) => {
  const urlOfImage = '/password-visibility-image.svg';
  const urlOfActiveImage = '/password-visibility-active-image.svg';

  const [stateUrlOfImage, setStateUrlOfImage] = useState(urlOfImage);
  const [styleState, setStyleState] = useState(additionalStyle);
  const [isPress, setIsPress] = useState(false);

  const mouseOverHandler = () => {
    if (isPress) {
      setStateUrlOfImage(urlOfImage);
    } else {
      setStateUrlOfImage(urlOfActiveImage);
    }

    setStyleState({ ...additionalStyle, opacity: 1 })
  };
  const mouseOutHandler = () => {
    if (isPress) {
      setStateUrlOfImage(urlOfActiveImage);
    } else {
      setStateUrlOfImage(urlOfImage);
    }

    setStyleState(additionalStyle)
  };

  return (
    <Button
      className='only-icon--small'
      additionalStyle={styleState}
      title='Показать / скрыть пароль'
      clickHandler={() => {
        setIsPress(!isPress);
        if (isPress) {
          mouseOverHandler();
        } else {
          mouseOutHandler();
        }
        clickHandler();
      }}
      onMouseOver={mouseOverHandler}
      onMouseOut={mouseOutHandler}
    >
      <img src={stateUrlOfImage} alt="Icon" className={style.icon} />
    </Button>
  );
});

export default ButtonPassword;