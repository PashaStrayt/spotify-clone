import DialogPopup from './../../molucules/Popups/DialogPopup/DialogPopup';
import { useState } from 'react';
import Button from './../../atoms/Buttons/Button/Button';
import { stringToBoolean } from './../../../shared/workingWithTypes';
import Heading from './../../atoms/Heading/Heading';
import Span from './../../atoms/Span/Span';
import InputCheckbox from '../../atoms/Inputs/InputCheckbox/InputCheckbox';

const FirstDialogPopup = () => {
  const [checked, setChecked] = useState(false);
  const [isOpened, setIsOpened] = useState(
    !stringToBoolean(localStorage.getItem('isWarningHidden'))
  );

  const onClose = () => {
    localStorage.setItem('isWarningHidden', checked);
    setIsOpened(false);
  };

  return (
    <DialogPopup isOpened={isOpened} onClose={onClose}>
      <Heading level={3}><Span color='green'>ВНИМАНИЕ</Span></Heading>
      <p style={{ opacity: 0.95 }}>
        Приложение размещено на бесплатном хостинге,
        и спустя некоторое время простоя, <Span color='green'>сервер «засыпает»</Span>,
        из за чего первая <Span color='green'>загрузка</Span> может занять около <Span color='green'>20-30 секунд</Span>.<br />
        <em>Спасибо за понимание</em> 🙃
      </p>
      <p style={{ opacity: 0.85, fontSize: '19px', marginBottom: '20px' }}>
        Также советую <Span color='green'>сделать масштаб страницы - 80%</Span> для более корректного отображения контента.<br />
        Для этого зажмите <code>Ctrl</code> и нажимайте <code>-</code>
        на Numpad, или крутите колесико мыши.
      </p>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', gap: '32px' }}>
        <Button className='transparent' clickHandler={onClose}>
          Закрыть
        </Button>
        <InputCheckbox
          text='Больше не показывать'
          checked={checked}
          changeHandler={() => setChecked(prev => !prev)}
        />
      </div>
    </DialogPopup>
  );
};

export default FirstDialogPopup;