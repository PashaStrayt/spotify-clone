import { createElement } from 'react';
import styles from './styles.module.scss';
import className from 'classnames';

const Heading = ({ level, align, additionalStyle, ...props }) => {
  return createElement(`h${level}`, {
    className: className({
      [styles.primary]: level === 1,
      [styles.secondary]: level === 2,
      [styles.center]: align === 'center'
    }),
    style: additionalStyle,
    ...props
  });
};

export default Heading;