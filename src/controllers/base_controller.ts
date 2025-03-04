import mongoose from "mongoose";
import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<T> {
    model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async AddANew(req: Request, res: Response) {
        console.log(req.body);
        try {
            const post = await this.model.create(req.body);
            res.status(201).send(post);
        } catch (err) {
            res.status(400).send(err);
        }
    }

 

    async deleteById(req: Request, res: Response) {
        const id = req.params.id;
        console.log("Received request to delete post with ID:", id);
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid ID format:", id);
            return res.status(400).json({ error: "Invalid ID format" });
        }
    
        try {
            const deletedItem = await this.model.findByIdAndDelete(id);
    
            if (!deletedItem) {
                console.log("Post not found with ID:", id);
                return res.status(404).json({ error: "Item not found" });
            }
    
            console.log("Post successfully deleted:", deletedItem);
            res.status(200).json(deletedItem);
        } catch (err) {
            console.error("Error deleting post:", err); // 🔹 הדפס את השגיאה
            if (err instanceof Error) {
                res.status(500).json({ error: "Internal Server Error", details: err.message });
            } else {
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    }

    

    async getAll(req: Request, res: Response) {
        const filter = req.query;
        console.log(filter);
        try {
            if (filter.owner) {
                const posts = await this.model.find({ owner: filter.owner });
                return res.send(posts);
            } else {
                const posts = await this.model.find();
                return res.send(posts);
            }
        } catch (err) {
            return res.status(400).send(err);
        }
    }

    async getById(req: Request, res: Response) {
        const postId = req.params.id;
        try {
            const post = await this.model.findById(postId);
            if (post === null) {
                return res.status(404).send("Post not found");
            } else {
                return res.status(200).send(post);
            }
        } catch (err) {
            console.log(err);
            res.status(404).send(err);
        }
    }

    async updateA(req: Request, res: Response) {
        const postId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).send("Invalid post ID format");
        }

        try {
            const updatedPost = await this.model.findByIdAndUpdate(postId, req.body, { new: true, runValidators: true });

            if (!updatedPost) {
                return res.status(404).send("Post not found");
            }

            res.send(updatedPost);
        } catch (err) {
            res.status(400).send(err);
        }
    }
}

const createController = <T>(model: Model<T>) => {
    return new BaseController(model);
};

export default createController;