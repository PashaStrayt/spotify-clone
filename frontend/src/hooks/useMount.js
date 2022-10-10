import { useEffect, useState } from 'react';

export const useMount = ({ isOpened, animationDuration = 400 }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpened && !isMounted) {
      setIsMounted(true);
    } else if (!isOpened && isMounted) {
      setTimeout(() => setIsMounted(false), animationDuration);
    }
  }, [isOpened]);

  return isMounted;
};