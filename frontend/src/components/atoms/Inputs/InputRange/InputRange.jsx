import { useState, useEffect } from 'react';
import styles from './styles.module.scss';
import className from 'classnames';

const calcGradientPercents = (value, max) => {
  return Math.floor(Number(value) / Number(max) * 100);
};

const InputRange = ({ type, min, value, max, step, mouseUpHandler, ...props }) => {
  const [gradientPercents, setGradientPercents] = useState(0);

  const changeHandler = event => {
    const percents = calcGradientPercents(event.target.value, event.target.max);
    setGradientPercents(percents);
    if (props.changeHandler) {
      props.changeHandler(event);
    }
  };

  useEffect(() => {
    const percents = calcGradientPercents(value, max);
    setGradientPercents(percents);
  }, [value]);

  return (
    <input
      className={className(styles.self, styles['self--' + type])}
      style={{ background: `-webkit-linear-gradient(left, #63CF6C 0, #63CF6C ${gradientPercents}%, rgba(255, 255, 255, 0.5) ${gradientPercents}%, rgba(255, 255, 255, 0.5) 100%)` }}
      type='range'
      min={min}
      value={value}
      max={max}
      step={step}
      onChange={changeHandler}
      onMouseUp={mouseUpHandler}
    />
  );
};

export default InputRange;