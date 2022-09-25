import { useState, useEffect } from 'react';
import { list } from './list'
import style from './styles.module.scss';
import className from 'classnames';

const IconButton = ({ name, initialIsClicked, isApplyingHover = true, additionalStyle, clickHandler, ...props }) => {
  const [isClicked, setIsClicked] = useState(initialIsClicked);
  const [isHover, setIsHover] = useState(initialIsClicked);
  const { title, imageUrl, activeImageUrl, size, doesRememberClicks } = list[name];

  useEffect(() => {
    if (props?.isClicked) {
      setIsClicked(props.isClicked);
    }
  }, [props?.isClicked]);

  return (
    <button
      title={title}
      className={className(style.self, style['self--' + size])}
      style={additionalStyle}
      onClick={event => {
        clickHandler(event);
        if (doesRememberClicks) {
          setIsClicked(prev => !prev);
        }
      }}
      onMouseOver={isApplyingHover ? () => setIsHover(true) : null}
      onMouseOut={isApplyingHover ? () => setIsHover(false) : null}
    >
      <img className={style.icon} src={(isClicked || isHover) && activeImageUrl ? activeImageUrl : imageUrl} alt="Icon button" />
    </button>
  );
};

export default IconButton;