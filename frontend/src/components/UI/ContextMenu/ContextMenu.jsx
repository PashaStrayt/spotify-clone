import style from './ContextMenu.module.scss';

const ContextMenu = ({ children, additionalStyle }) => {
  return (
    <div className={style.menu} style={additionalStyle}>
      {children}
    </div>
  );
};

export default ContextMenu;