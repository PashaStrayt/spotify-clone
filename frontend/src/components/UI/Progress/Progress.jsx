import { useEffect } from 'react';
import { useState } from 'react';
import style from './Progress.module.scss';

const calcGradientPercents = (value, max) => {
  return Math.floor(Number(value) / Number(max) * 100);
};

const Progress = ({ min, value, max, step, className, changeHandler, mouseUpHandler }) => {
  const [gradientPercents, setGradientPercents] = useState(0);

  const inputHandler = event => {
    const percents = calcGradientPercents(event.target.value, event.target.max);
    setGradientPercents(percents);
    if (changeHandler) {
      changeHandler(event);
    }
  };

  useEffect(() => {
    const percents = calcGradientPercents(value, max);
    setGradientPercents(percents);
  }, [value]);

  return (
    <input
      type='range'
      min={min}
      value={value}
      max={max}
      step={step}
      className={style[className]}
      style={{ background: `-webkit-linear-gradient(left, #63CF6C 0, #63CF6C ${gradientPercents}%, rgba(255, 255, 255, 0.5) ${gradientPercents}%, rgba(255, 255, 255, 0.5) 100%)` }}
      onChange={inputHandler}
      onMouseUp={mouseUpHandler}
    />
  );
};

export default Progress;