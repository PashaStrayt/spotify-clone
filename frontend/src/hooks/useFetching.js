import { uiStore } from './../stores/UIStore';
import { useCallback } from 'react';

export const useFetching = callback => {
  const fetching = useCallback(async () => {
    try {
      uiStore.changeIsLoading();
      await callback();
    } catch (error) {
      uiStore.setErrorMessage(error.message);
    } finally {
      uiStore.changeIsLoading();
    }
  }, []);

  return fetching;
};