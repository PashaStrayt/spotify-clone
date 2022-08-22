import { useState } from "react";
import { uiStore } from "../store/UIStore";

export const useFetching = callback => {
  const [error, setError] = useState(true);

  const fetching = async () => {
    try {
      uiStore.changeIsLoading();
      await callback();
    } catch (error) {
      setError(error.message);
    } finally {
      uiStore.changeIsLoading();
    }
  };

  return [fetching, error];
};