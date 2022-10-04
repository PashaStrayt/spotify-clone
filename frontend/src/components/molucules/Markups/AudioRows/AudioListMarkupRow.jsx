import styles from './styles.module.scss';
import className from 'classnames';

const AudioListMarkupRow = () => {
  return (
    <div className={className(styles.container, styles['container--audio-list'])}>
      <p className={className(styles.column, styles.number)}>#</p>
      <p className={className(styles.column, styles.name)}>НАЗВАНИЕ</p>
      <div className={className(styles.column, styles['column--empty'])} />
      <p className={className(styles.column, styles['album-name'])}>АЛЬБОМ</p>
      <p className={className(styles.column, styles.format)}>ФОРМАТ</p>
      {/* <div className={className(styles.column, styles['column--empty'])} /> */}
      <img
        className={className(styles.column, styles.duration)}
        src="/duration-image.svg"
        alt="Duration icon"
      />
      <div className={className(styles.column, styles['column--empty'])} />
      <div className={className(styles.column, styles['column--empty'])} />
    </div>
  );
};

export default AudioListMarkupRow;