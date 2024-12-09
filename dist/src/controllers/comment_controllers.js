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
const mongoose_1 = __importDefault(require("mongoose"));
const Comments_model_1 = __importDefault(require("../models/Comments_model"));
const AddANewComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const comment = yield Comments_model_1.default.create(req.body);
        res.status(201).send(comment);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const getAllComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query;
    console.log(filter);
    try {
        if (filter.postId) {
            const comments = yield Comments_model_1.default.find({ postId: filter.postId });
            return res.send(comments);
        }
        else {
            const comments = yield Comments_model_1.default.find();
            return res.send(comments);
        }
    }
    catch (err) {
        return res.status(400).send(err);
    }
});
const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    try {
        const comment = yield Comments_model_1.default.findById(commentId);
        if (comment === null) {
            return res.status(404).send("comment not found");
        }
        else {
            return res.status(200).send(comment);
        }
    }
    catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
});
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(commentId)) {
        return res.status(400).send("Invalid comment ID format");
    }
    try {
        const deletedComment = yield Comments_model_1.default.findByIdAndDelete(commentId, { new: true, runValidators: true });
        //const deletedComment = await Comment.findByIdAndDelete(commentId, req.body,
        // { new: true, runValidators: true });
        if (!deletedComment) {
            return res.status(404).send("comment not found");
        }
        res.send(deletedComment);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(commentId)) {
        return res.status(400).send("Invalid comment ID format");
    }
    try {
        const updatedComment = yield Comments_model_1.default.findByIdAndUpdate(commentId, req.body, { new: true, runValidators: true });
        if (!updatedComment) {
            return res.status(404).send("comment not found");
        }
        res.send(updatedComment);
    }
    catch (err) {
        res.status(400).send(err);
    }
});
exports.default = { AddANewComment, getAllComments, getCommentById, deleteComment, updateComment };
//# sourceMappingURL=comment_controllers.js.map