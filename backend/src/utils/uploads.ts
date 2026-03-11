import fs from 'fs';
import path from 'path';

export const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export const ensureUploadsDir = () => {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
};

export const resolveUploadUrlToPath = (url?: string | null) => {
  if (!url?.startsWith('/uploads/')) {
    return null;
  }

  const relativePath = url.replace(/^\/uploads\//, '');
  return path.join(UPLOADS_DIR, relativePath);
};
