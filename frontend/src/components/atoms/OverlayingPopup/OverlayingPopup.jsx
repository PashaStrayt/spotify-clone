import styles from './styles.module.scss';
import { Portal } from 'react-portal';
import className from 'classnames';
import { useMount } from '../../../hooks/useMount';
import { Transition } from 'react-transition-group';
import { useEffect, useState } from 'react';

const ANIMATION_DURATION = 400;

const OverlayingPopup = ({ isBackground = true, isOverlay = true, children, isOpened, onClose }) => {
  const isMounted = useMount({ isOpened });
  const [isAnimation, setIsAnimation] = useState(false);

  useEffect(() => {
    setIsAnimation(!!isOpened);
  }, [isOpened])

  if (!isMounted) {
    return null;
  }

  return (
    <Portal>
      <Transition
        in={isAnimation}
        timeout={ANIMATION_DURATION}
        mountOnEnter
        unmountOnExit
      >
        {
          state =>
            <div className={className(styles.container, styles['container-' + state])}>
              {
                isOverlay &&
                <Transition
                  in={isAnimation}
                  timeout={ANIMATION_DURATION}
                  mountOnEnter
                  unmountOnExit
                >
                  {
                    state =>
                      <div
                        className={className(styles.overlay, styles[state], {
                          [styles.background]: isBackground
                        })}
                        onClick={onClose}
                      />
                  }
                </Transition>
              }
              {children}
            </div>
        }
      </Transition>
    </Portal>
  );
};

export default OverlayingPopup;