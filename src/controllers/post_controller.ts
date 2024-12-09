import PostModel,{IPost} from "../models/posts_model";
import mongoose from "mongoose";
import { Request, Response } from "express";
import createController from "./base_controller";

const postController = createController<IPost>(PostModel);

export default postController;