import classNames from 'classnames';
import styles from './styles.module.scss';

const Button = ({ children, className, isWidthAuto, additionalStyle, clickHandler, title, ...props }) => {
  return (
    <button
      className={classNames(styles[className], {
        [styles['width-auto']]: isWidthAuto
      })}
      styles={additionalStyle}
      onClick={event => {
        event.preventDefault();
        clickHandler(event);
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;