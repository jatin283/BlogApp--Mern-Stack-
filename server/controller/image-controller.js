import grid from 'gridfs-stream';

import mongoose from 'mongoose';

const url = 'https://blog-app-epup.onrender.com';

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'fs'
    });
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection('fs');
})

export const uploadImage = (request, response) => {
    console.log("RequestFileeee",request.file);
    if (!request.file) {
        return response.status(404).json("File not found");
    }

    const imageUrl = `${url}/file/${request.file.filename}`;
     response.status(200).json(imageUrl);
}

export const getImage = async (request, response) => {
    try {
        const file = await gfs.files.findOne({ fileName: request.params.filename });
        const readStream = gridfsBucket.openDownloadStream(file._id);
        readStream.pipe(response);
    } catch (error) {
        return response.status(500).json({msg: error.message})
    }
}