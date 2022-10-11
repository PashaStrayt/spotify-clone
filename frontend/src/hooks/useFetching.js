import { uiStore } from './../stores/UIStore';

export const useFetching = callback => {
  const fetching = async () => {
    try {
      uiStore.changeIsLoading();
      await callback();
    } catch (error) {
      uiStore.setErrorMessage(error.message);
    } finally {
      uiStore.changeIsLoading();
    }
  };

  return fetching;
};