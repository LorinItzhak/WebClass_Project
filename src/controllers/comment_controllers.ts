
import mongoose from "mongoose";
import Comment from "../models/Comments_model";
import { Request, Response } from "express";

const AddANewComment = async (req:Request, res:Response) => {
    console.log(req.body);
    try {
        const comment = await Comment.create(req.body);
        res.status(201).send(comment);
    }
    catch (err) {
        res.status(400).send(err);
    }
};

const getAllComments = async (req:Request, res:Response) => {
    const filter = req.query;
    console.log(filter);
    try {
        if (filter.postId) {
            const comments = await Comment.find({ postId: filter.postId });
            return res.send(comments);
        }
        else {
            const comments = await Comment.find()
            return res.send(comments);
        }
    }
    catch (err) { return res.status(400).send(err); }
};

const getCommentById = async (req:Request, res:Response) => {
    const commentId = req.params.id;
    try {
        const comment = await Comment.findById(commentId);
        if (comment === null) {
            return res.status(404).send("comment not found");
        } else {
            return res.status(200).send(comment);
        }
    } catch (err) {
        console.log(err)
        res.status(404).send(err);
    }
};




const deleteComment = async (req:Request, res:Response) => {
    const commentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).send("Invalid comment ID format");
    }

    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId, { new: true, runValidators: true });

        //const deletedComment = await Comment.findByIdAndDelete(commentId, req.body,
           // { new: true, runValidators: true });

        if (!deletedComment) {
            return res.status(404).send("comment not found");
        }

        res.send(deletedComment);
    } catch (err) {
        res.status(400).send(err);
    }

};

const updateComment = async (req:Request, res:Response) => {
    const commentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        return res.status(400).send("Invalid comment ID format");
    }

    try {

        const updatedComment = await Comment.findByIdAndUpdate(commentId, req.body, { new: true, runValidators: true });

        if (!updatedComment) {
            return res.status(404).send("comment not found");
        }

        res.send(updatedComment);
    } catch (err) {
        res.status(400).send(err);
    }
};




export default { AddANewComment, getAllComments, getCommentById, deleteComment, updateComment };

