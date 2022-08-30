import style from './AudioWave.module.scss';

const AudioWave = () => {
  return (
    <div className={style['wave']}>
      <div className={[style['wave__item'], style['wave__item--one']].join(' ')}></div>
      <div className={[style['wave__item'], style['wave__item--two']].join(' ')}></div>
      <div className={[style['wave__item'], style['wave__item--three']].join(' ')}></div>
      <div className={[style['wave__item'], style['wave__item--four']].join(' ')}></div>
    </div>
  );
};

export default AudioWave;