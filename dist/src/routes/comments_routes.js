"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const comment_controllers_1 = __importDefault(require("../controllers/comment_controllers"));
router.post('/', (req, res) => {
    comment_controllers_1.default.AddANew(req, res);
});
router.get('/', (req, res) => {
    comment_controllers_1.default.getAll(req, res);
});
router.get('/:id', (req, res) => {
    comment_controllers_1.default.getById(req, res);
});
router.put('/:id', (req, res) => {
    comment_controllers_1.default.updateA(req, res);
});
exports.default = router;
//# sourceMappingURL=comments_routes.js.map