import styles from './styles.module.scss';
import className from 'classnames';
import { useEffect, useState } from 'react';
import { Transition } from 'react-transition-group';
import { useRef } from 'react';

const MessagePopup = ({ message, type, clearMessage }) => {
  const [isOpened, setIsOpened] = useState(!!message);
  const ref = useRef();

  useEffect(() => {
    if (message) {
      ref.timeout1 = setTimeout(clearMessage, 12000);
      ref.timeout2 = setTimeout(() => setIsOpened(false), 10000);
      setIsOpened(true);
    }
  }, [message]);

  const mouseOverHandler = () => {
    clearTimeout(ref.timeout1);
    clearTimeout(ref.timeout2);
  };

  const mouseOutHandler = () => {
    ref.timeout1 = setTimeout(clearMessage, 12000);
    ref.timeout2 = setTimeout(() => setIsOpened(false), 10000);
  };

  return (
    <Transition
      in={isOpened}
      timeout={1000}
      mountOnEnter
      unmountOnExit
    >
      {state =>
        <p 
        className={className(styles.self, styles[state], {
          [styles['self--error']]: type === 'error'
        })}
        onMouseOver={mouseOverHandler}
        onMouseOut={mouseOutHandler}
        >
          {message}
        </p>}
    </Transition>
  );
};

export default MessagePopup;