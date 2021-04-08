import { FileUpload } from '../interfaces/file-upload';

const uniqid = require('uniqid');
const path = require('path');
const fs = require('fs');

export default class FileSystem {

    constructor() {};

    saveTempImage(file: FileUpload, userId: string) {
        return new Promise((resolve, reject) => {
            // Make folder
            const path = this.makeUserFolder(userId);
    
            // Rename file
            const fileName = this.makeUniqueName(file.name);
    
            // Move file to user temp folder
            file.mv(`${path}/${fileName}`, (err: any) => {
                if (err) reject(err);
                else resolve(true);
            });
        })
    }

    private makeUserFolder(userId: string) {
        const userPath = path.resolve(__dirname, '../uploads/', userId);
        const userTempPath = userPath + '/temp';
        console.log("user path: ", userPath);

        const exist = fs.existsSync(userPath);

        if (!exist) {
            fs.mkdirSync(userPath);
            fs.mkdirSync(userTempPath);
        }

        return userTempPath;
    }

    private makeUniqueName(orinalName: string) {
        const nameArr = orinalName.split('.');
        const ext = nameArr[nameArr.length - 1];

        const id = uniqid();

        return `${id}.${ext}`;
    }

    moveImageFromTempToPost(userId: string) {
        const tempPath = path.resolve(__dirname, '../uploads/', userId, 'temp');
        const postsPath = path.resolve(__dirname, '../uploads/', userId, 'posts');

        if (!fs.existsSync(tempPath)) return [];
        if (!fs.existsSync(postsPath)) {
            fs.mkdirSync(postsPath);
        }

        const tempImages = this.getTempImages(userId);
        tempImages.forEach((image: any) => {
            fs.renameSync(`${tempPath}/${image}`, `${postsPath}/${image}`);
        });

        return tempImages;
    }

    private getTempImages(userId: string) {
        const tempPath = path.resolve(__dirname, '../uploads/', userId, 'temp');

        return fs.readdirSync(tempPath) || [];
    }

    getImageUrl(userId: string, image: string) {
        const imagePath = path.resolve(__dirname, '../uploads/', userId, 'posts', image);

        const exist = fs.existsSync(imagePath);
        if (!exist) return path.resolve(__dirname, '../assets/400x250.jpg');

        return imagePath;
    }

}