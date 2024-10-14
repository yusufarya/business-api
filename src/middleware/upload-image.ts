// middleware/upload.ts
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export class UploadImage {
    static uploadSingleImage(destinationPath : String) {
        const storage = multer.diskStorage({
            destination: async (req, file, cb) => {
                let dir;
                if (process.env.NODE_ENV === 'production') {
                    dir = path.join(__dirname, "../../dist/public/images/"+destinationPath);
                } else {
                    dir = path.join(__dirname, "../../src/public/images/"+destinationPath);
                }
                // Ensure directory exists
                await fs.promises.mkdir(dir, { recursive: true });
                cb(null, dir);
            },
            filename: (req, file, cb) => {
                const uniqId = uuidv4();
                cb(null, uniqId + "_" + file.originalname);
            },
        });

        const upload = multer({ storage });
        return upload.single("file");
    }
}
