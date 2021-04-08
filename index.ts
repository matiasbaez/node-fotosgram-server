import Server from './classes/server';
import userRoutes from './routes/user';
import postRoutes from './routes/post';

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const server = new Server();

// Body parse
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

// File upload
server.app.use(fileUpload({useTempFiles: true}));

// CORS
server.app.use(cors({origin: true, credentials: true}));

// Routes
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);

// BD Conexion
mongoose.connect('mongodb://localhost:27017/fotosgram', {
    useNewUrlParser: true, useCreateIndex: true
}, (err: any) => {
    if (err) throw err;
    console.log('BD Connected');
});

server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});