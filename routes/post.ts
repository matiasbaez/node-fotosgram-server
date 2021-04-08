import { Router, Response, Request } from 'express';

import { FileUpload } from '../interfaces/file-upload';
import { verifyToken } from '../middlewares/auth';
import { Post } from '../models/post.model';

import FileSystem from '../classes/file-system';

const postRoutes = Router();
const fileSystem = new FileSystem();

// Crear Post
postRoutes.post('/', [verifyToken], (req: any, res: Response) => {

    const body = req.body;
    body.user = req.user._id;

    const images = fileSystem.moveImageFromTempToPost(req.user._id);
    body.imgs = images;

    Post.create(body).then(async createdPost => {

        await createdPost.populate('user', '-password').execPopulate();

        res.json({
            success: true,
            post: createdPost
        })
    }).catch(err => {
        res.json({
            success: false,
            err
        })
    })
});

// Obtener Post paginado
postRoutes.get('/', async (req: any, res: Response) => {
    let page = Number(req.query.page) || 1;
    let skip = page - 1;
        skip = skip * 10;

    const posts = await Post.find()
        .sort({_id: -1})
        .skip(skip)
        .limit(10)
        .populate('user', '-password')
        .exec();

    res.json({
        success: true,
        page,
        posts
    })
});

// Subir archivos
postRoutes.post('/upload', [verifyToken], async (req: any, res: Response) => {
    if (!req.files) return res.status(400).json({
        success: false,
        message: 'No se subio ningun archivo'
    })

    const file: FileUpload = req.files.image;

    if (!file) {
        return res.status(400).json({
            success: false,
            message: 'No se subio ningun archivo'
        });
    }

    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            success: false,
            message: 'El formato del archivo no es valido'
        });
    }

    await fileSystem.saveTempImage(file, req.user._id);

    res.json({
        success: true,
        file: file.mimetype,
        test: 'TEST'
    })
});

postRoutes.get('/image/:userid/:img', (req: any, res: Response) => {
    const userId = req.params.userid;
    const img = req.params.img;

    const imagePath = fileSystem.getImageUrl(userId, img);
    
    res.sendFile(imagePath);
});

export default postRoutes;