import { base64ToImage } from '../utils/base64';
import { detector, pointer, recognizer } from '../../app';

export const detect = (base64: string) => {
  const image = base64ToImage(base64);
  return detector.detectSync(image);
};

export const landmark = (base64: string) => {
  const image = base64ToImage(base64);
  return pointer.detectSync(image, detector);
};

export const register = (base64: string) => {
  const image = base64ToImage(base64);
  return recognizer.register(image, detector, pointer);
};

export const identify = (base64: string) => {
  const image = base64ToImage(base64);
  return recognizer.recognizeSync(image, detector, pointer);
};

export const compare = (base64_1: string, base64_2: string) => {
  const image1 = base64ToImage(base64_1);
  const image2 = base64ToImage(base64_2);
  return recognizer.compareSync([image1, image2], detector, pointer);
};
