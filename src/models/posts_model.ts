import mongoose from "mongoose";
const Schema = mongoose.Schema;

 export interface IPost {
    title: string;
    content: string;
    owner: string;
}

const postSchema = new Schema<IPost>({
    title:{
        type:String,
        required:true,
    },
    content:String,
    owner:{
        type:String,
        required:true,
    },
});
const PostModel= mongoose.model<IPost>("Posts", postSchema);
export default PostModel;