import { Schema, Document, model } from 'mongoose';

const postSchema = new Schema({
    createdAt:  {type: Date, default: new Date()},
    message:    {type: String},
    imgs:        [{type: String}],
    coords:     {type: String},
    user:    {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

interface IPost extends Document {
    createdAt: Date,
    message: String,
    coords: String,
    usuario: String
}

export const Post = model<IPost>('Post', postSchema);