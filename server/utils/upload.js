import multer from 'multer';
import {GridFsStorage} from 'multer-gridfs-storage';
import dotenv from 'dotenv'

dotenv.config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const URL= process.env.MONGODB_URL;

const storage = new GridFsStorage({
    url: URL,
    options: { useNewUrlParser: true },
    file: (request, file) => {
        console.log('Fileeeeeeee:', file);
        const match = ["image/png", "image/jpg", "image/jpeg"];

        if(match.indexOf(file.mimetype) === -1) {
            console.log('Invalid file type');
            return `${Date.now()}-blog-${file.originalname}`;
        }

        console.log('Valid file type');
        return {
            bucketName: "photos",
            filename: `${Date.now()}-blog-${file.originalname}`
        }
    },

})

const upload = multer({storage});

export default upload;

