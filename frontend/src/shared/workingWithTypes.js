export const deepCopy = data => {
  if (data && Array.isArray(data)) {
    return data.map(item => deepCopy(item));
  } else if (data && typeof data === 'object') {
    const obj = {};
    Object.entries(data).forEach(([property, value]) => {
      obj[property] = deepCopy(value);
    });
    return obj;
  } else {
    return data;
  }
};

export const addZeroToStringBeginning = string => {
  if (string.toString().length === 1) {
    return `0${string}`
  }
  return string;
};

export const shuffleArray = array => {
  const arrayCopy = deepCopy(array);

  for (let i = arrayCopy.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }

  return arrayCopy;
};

export const isEmailValid = email => {
  const rage = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  return rage.test(email);
};

export const stringToBoolean = string => {
  if (string === 'true') {
    return true;
  } else if (string === 'false') {
    return false;
  }
};