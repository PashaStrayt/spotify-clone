import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useState } from 'react';
import { uiStore } from '../../../store/UIStore';
import Button from '../Button/Button';
import { buttonsIconList } from './buttonsIconList'
import style from './ButtonIcon.module.scss';

const ButtonIcon = observer(({ buttonName, additionalStyle, clickHandler }) => {
  const { title, urlOfImage, urlOfActiveImage, size } = buttonsIconList[buttonName];

  const [stateUrlOfImage, setStateUrlOfImage] = useState(urlOfImage);
  const [styleState, setStyleState] = useState(additionalStyle);
  const [mouseOverHandler, setMouseOverHandler] = useState();
  const [mouseOutHandler, setMouseOutHandler] = useState();

  const makeButtonEnable = () => {
    if (urlOfActiveImage) {
      setStateUrlOfImage(urlOfActiveImage);
    }

    setStyleState({ ...additionalStyle, opacity: 1 })
  };
  const makeButtonDisable = () => {
    if (urlOfActiveImage) {
      setStateUrlOfImage(urlOfImage);
    }

    setStyleState(additionalStyle)
  };

  useEffect(() => {
    if (uiStore.whichButtonIconActive === buttonName) {
      setMouseOverHandler(null);
      setMouseOutHandler(null);
      makeButtonEnable();
    } else {
      setMouseOverHandler(() => makeButtonEnable);
      setMouseOutHandler(() => makeButtonDisable);
      makeButtonDisable();
    }
  }, [uiStore.whichButtonIconActive]);

  return (
    <Button
      className={'only-icon--' + size}
      additionalStyle={styleState}
      clickHandler={() => {
        uiStore.setButtonIconActive(buttonName);
        clickHandler();
      }}
      title={title}
      onMouseOver={mouseOverHandler}
      onMouseOut={mouseOutHandler}
    >
      <img src={stateUrlOfImage} alt="Icon" className={style.icon} />
    </Button>
  );
});

export default ButtonIcon;