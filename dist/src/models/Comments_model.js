"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const commentSchema = new Schema({
    postId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
});
const comment = mongoose_1.default.model("comment", commentSchema);
exports.default = comment;
//# sourceMappingURL=Comments_model.js.map