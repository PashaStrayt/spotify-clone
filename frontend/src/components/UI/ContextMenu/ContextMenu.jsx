import style from './ContextMenu.module.scss';

const ContextMenu = ({ children }) => {
  return (
    <div className={style.menu}>
      {children}
    </div>
  );
};

export default ContextMenu;