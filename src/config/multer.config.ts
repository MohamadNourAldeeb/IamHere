import { Request } from 'express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const uploadPath = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const uploadProfilePath = path.join(
  __dirname,
  '..',
  '..',
  'uploads',
  'profiles',
);
if (!fs.existsSync(uploadProfilePath)) {
  fs.mkdirSync(uploadProfilePath, { recursive: true });
}

const uploadCompanyPath = path.join(
  __dirname,
  '..',
  '..',
  'uploads',
  'company',
);
if (!fs.existsSync(uploadCompanyPath)) {
  fs.mkdirSync(uploadCompanyPath, { recursive: true });
}

export const multerOptions = {
  public: {
    storage: diskStorage({
      destination: (req: Request, file: any, cb: any) => {
        cb(null, uploadPath);
      },
      filename: (req: Request, file: any, cb: any) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
      },
    }),
  },
  profile: {
    storage: diskStorage({
      destination: (req: Request, file: any, cb: any) => {
        cb(null, uploadProfilePath);
      },
      filename: (req: Request, file: any, cb: any) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
      },
    }),
  },
  Company: {
    storage: diskStorage({
      destination: (req: Request, file: any, cb: any) => {
        cb(null, uploadCompanyPath);
      },
      filename: (req: Request, file: any, cb: any) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
      },
    }),
  },
};
