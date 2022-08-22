export const makeDurationString = duration => {
  const addNullToString = string => {
    if (string.toString().length === 1) {
      return `0${string}`
    }
    return string;
  }

  duration = parseInt(duration);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return addNullToString(minutes) + ' : ' + addNullToString(seconds);
};