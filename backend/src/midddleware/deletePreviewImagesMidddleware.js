import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { copyFile, readdir, readdirSync, unlink } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const deletePreviewImagesMidddleware = (request, response, next) => {
  try {
    const dirPath = resolve(__dirname, '..', '..', 'static', 'image-preview');
    readdir(dirPath, (error, files) => {
      if (error) throw error;

      for (let file of files) {
        unlink(resolve(dirPath, file), error => {
          if (error) throw error;
        });
      }
    });

    return next();
  }
  catch (error) {
    return response.status(500).json({ message: error.message });
  }
};