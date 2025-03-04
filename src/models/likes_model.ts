import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface ILike {
    postId: string;
    owner: mongoose.Types.ObjectId;
}

const likeSchema = new Schema<ILike>({
    postId: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const likeModel = mongoose.model<ILike>("likes", likeSchema);
export default likeModel;