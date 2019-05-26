import { Image } from 'seeta';
import { writeFileSync } from 'fs';

export const base64toTmpFile = (base64: string) => {
  const timestamp = Date.now();
  const pathname = `/tmp/${timestamp}`;
  writeFileSync(pathname, Buffer.from(base64, 'base64'));
  return pathname;
};

export const base64ToImage = (base64: string) => {
  const pathname = base64toTmpFile(base64);
  return new Image(pathname);
};
