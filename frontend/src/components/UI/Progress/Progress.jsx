import style from './Progress.module.scss';

const Progress = ({ value, max, className }) => {
  return (
    <progress
      value={value}
      max={max}
      className={style[className]}
      // onMouseDown={event => {
      //   setStartPoint(event.pageX);
        
      //   const endPoint = Math.floor(event.pageX - ref.current.offsetLeft);
      //     const progress = endPoint / (ref.current.offsetWidth / 222);
      //     ref.current.value = progress;
      // }}
      // onMouseMove={event => {
      //   if (startPoint) {
      //     const endPoint = Math.floor(event.pageX - ref.current.offsetLeft);
      //     const progress = endPoint / (ref.current.offsetWidth / 222);
      //     ref.current.value = progress;
      //   }
      // }}
      // onMouseUp={event => {
      //   const endPoint = Math.floor(event.pageX - ref.current.offsetLeft);
      //   const progress = endPoint / (ref.current.offsetWidth / 222);
      //   ref.current.value = progress;
      //   setStartPoint(null)
      // }}
    >
    </progress>
  );
};

export default Progress;