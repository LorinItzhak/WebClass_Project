import likeModel, { ILike } from "../models/likes_model";
import mongoose from "mongoose";
import { Request, Response } from "express";
import createController from "./base_controller";

const likesController = createController<ILike>(likeModel);

export default likesController;