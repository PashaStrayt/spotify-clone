import style from './LoadingWheel.module.scss';

const LoadingWheel = () => {
  return (
    <div className={style.plate}>
      <div className={style['pong-loader']}></div>
      Загрузка...
    </div>
  )
}
export default LoadingWheel