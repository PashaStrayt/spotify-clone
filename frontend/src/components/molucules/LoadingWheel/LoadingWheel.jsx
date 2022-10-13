import { Transition } from 'react-transition-group';
import styles from './styles.module.scss';
import { uiStore } from '../../../stores/UIStore';
import className from 'classnames';
import { observer } from 'mobx-react-lite';

const LoadingWheel = observer(() => {
  return (
    <Transition
      in={uiStore.isLoading || uiStore.isLoading2}
      timeout={500}
      mountOnEnter
      unmountOnExit
    >
      {state =>
        <div className={className(styles.plate, styles[state])}>
          <div className={styles['pong-loader']}></div>
          Загрузка...
        </div>
      }
    </Transition>
  )
});

export default LoadingWheel;