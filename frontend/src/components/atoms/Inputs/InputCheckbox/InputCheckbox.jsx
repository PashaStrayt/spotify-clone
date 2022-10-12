import classNames from 'classnames';
import styles from './styles.module.scss';

const InputCheckbox = ({ text, checked, changeHandler }) => {
  return (
    <label className={styles.label}>
      <input
        type="checkbox"
        checked={checked}
        onChange={changeHandler}
      />
      <div className={classNames(styles.checkbox, {[styles['checkbox--checked']]: checked})}>
        {checked && '✓'}
      </div>
      {text}
    </label>
  );
};

export default InputCheckbox;