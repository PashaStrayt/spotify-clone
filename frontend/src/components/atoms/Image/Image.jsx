import styles from './styles.module.scss';
import className from 'classnames';
import { PROXY_URL } from './../../../shared/workingWithFetch';

const Image = ({ isVisible = true, type, size, src, alt, additionalStyle }) => {
  return (
    <img
      className={className(styles.self, styles['self--' + type + (size ? '--' + size : '')], {
        [styles['self--visibled']]: isVisible
      })}
      src={src.includes(PROXY_URL) ? src : PROXY_URL + src}
      alt={alt}
      style={additionalStyle}
    />
  );
};

export default Image;