import style from './ModalWindow.module.scss';

const ModalWindow = ({ children, additionalStyle }) => {
  return (
    <div className={style.plate}>
      <div className={style.content} style={additionalStyle}>
        {children}
      </div>
    </div>
  );
};

export default ModalWindow;