import styles from './styles.module.scss';
import Button from '../../atoms/Buttons/Button/Button';

const SelectMethodPanel = ({ text, buttons }) => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>{text}</p>
      {
        buttons.map(({ isClicked, children, clickHandler }) =>
          <Button
            className={isClicked ? 'green' : 'transparent'}
            isWidthAuto={true}
            clickHandler={clickHandler}
            key={'Select-Method-Panel-' + children}
          >
            {children}
          </Button>
        )
      }
    </div>
  );
};

export default SelectMethodPanel;