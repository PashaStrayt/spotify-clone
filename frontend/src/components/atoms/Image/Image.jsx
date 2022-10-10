import styles from './styles.module.scss';
import className from 'classnames';

const Image = ({ isVisible = true, type, size, src, alt, additionalStyle }) => {
  return (
    <img
      className={className(styles.self, styles['self--' + type + (size ? '--' + size : '')], {
        [styles['self--visibled']]: isVisible
      })}
      src={src}
      alt={alt}
      style={additionalStyle}
    />
  );
};

export default Image;