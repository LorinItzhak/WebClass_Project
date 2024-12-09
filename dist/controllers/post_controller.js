"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_model_1 = __importDefault(require("../models/posts_model"));
const mongoose_1 = __importDefault(require("mongoose"));
const AddANewPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const post = yield posts_model_1.default.create(req.body);
        res.status(201).send(post);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getAllPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query;
    console.log(filter);
    try {
        if (filter.owner) {
            const posts = yield posts_model_1.default.find({ owner: filter.owner });
            return res.send(posts);
        }
        else {
            const posts = yield posts_model_1.default.find();
            return res.send(posts);
        }
    }
    catch (err) {
        return res.status(400).send(err);
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        const post = yield posts_model_1.default.findById(postId);
        if (post === null) {
            return res.status(404).send("post not found");
        }
        else {
            return res.status(200).send(post);
        }
    }
    catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
});
const updateAPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(postId)) {
        return res.status(400).send("Invalid post ID format");
    }
    try {
        const updatedPost = yield posts_model_1.default.findByIdAndUpdate(postId, req.body, { new: true, runValidators: true });
        if (!updatedPost) {
            return res.status(404).send("Post not found");
        }
        res.send(updatedPost);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
exports.default = { AddANewPost, getAllPost, updateAPost, getPostById };
//# sourceMappingURL=post_controller.js.map