import { uploadStore } from "../store/UploadStore";

export const makeFilesArray = () => {
  const formData = new FormData();

  formData.append('songsInfo', JSON.stringify(uploadStore.files.info));
  uploadStore.files.content.forEach((file, index) => {
    formData.append(index, file);
  });
  return formData;
}

export const makeValidFormat = name => {
  if (name.toLowerCase().includes('flac')) {
    return 'flac';
  }
  return name.slice(-3);
};

export const checkAcceptFormat = type => {
  const acceptFormats = [
    'audio/flac',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg'
  ];

  return acceptFormats.includes(type);
};

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