import styles from './styles.module.scss';
import { useState, useEffect } from 'react';
import classNames from 'classnames';

const CutByLimitParagraph = ({ className, isActive, children, limit }) => {
  const [cutText, setCutText] = useState(children);

  useEffect(() => {
    setCutText(
      children.length > limit ? children.slice(0, limit) + '...' : children
    );
  }, [children, limit]);

  return (
    <p className={classNames(styles[className], { [styles.active]: isActive })}>
      {cutText}
    </p>
  );
};

export default CutByLimitParagraph;