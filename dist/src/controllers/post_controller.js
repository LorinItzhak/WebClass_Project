"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_model_1 = __importDefault(require("../models/posts_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const postController = (0, base_controller_1.default)(posts_model_1.default);
exports.default = postController;
//# sourceMappingURL=post_controller.js.map