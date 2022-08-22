import style from './ModalWindow.module.scss';

const ModalWindow = ({ children }) => {
  return (
    <div className={style.plate}>
      <div className={style.content}>
        {children}
      </div>
    </div>
  );
};

export default ModalWindow;