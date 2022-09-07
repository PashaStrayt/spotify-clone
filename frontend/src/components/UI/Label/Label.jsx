import style from './Label.module.scss';

const Label = ({ className, additionalStyle, text }) => {
  return (
    <label className={style[className]} style={additionalStyle}>
      <p className={style.text}>{text}</p>
      {
        className === 'in-creating-content' &&
        <hr className={style.line} />
      }
    </label>
  );
};

export default Label;