import { useRef } from "react";
import { useEffect } from "react";

export const useIntersectionObserver = (observableRef, isAbleToLoad, isLoading, callback) => {
  const observer = useRef();
  
  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }
    
    if (!isLoading && observableRef?.current) {
      const observerCallback = entries => {
        if (entries[0].isIntersecting && isAbleToLoad) {
          callback();
        }
      };
  
      observer.current = new IntersectionObserver(observerCallback);
      observer.current.observe(observableRef?.current);
    }
  }, [isLoading]);
};