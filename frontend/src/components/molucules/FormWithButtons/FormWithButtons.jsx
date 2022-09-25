import classNames from 'classnames';
import Form from '../../atoms/Form/Form';
import Button from './../../atoms/Buttons/Button/Button';
import styles from './styles.module.scss';

const FormWithButtons = ({ justifyButtons, children, type, onSave, onCancel }) => {
  return (
    <Form type={type}>
      {children}
      <div className={classNames(styles.buttons, styles['buttons--' + justifyButtons])}>
        <Button className='green' clickHandler={onSave}>
          Готово
        </Button>
        <Button className='transparent' clickHandler={onCancel}>
          Отмена
        </Button>
      </div>
    </Form>
  );
};

export default FormWithButtons;