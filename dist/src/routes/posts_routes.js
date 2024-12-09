"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controllers/post_controller"));
router.post('/', post_controller_1.default.AddANew.bind(post_controller_1.default));
router.get('/', (req, res) => {
    post_controller_1.default.getAll(req, res);
});
router.get('/:id', (req, res) => {
    post_controller_1.default.getById(req, res);
});
router.put('/:id', (req, res) => {
    post_controller_1.default.updateA(req, res);
});
exports.default = router;
//# sourceMappingURL=posts_routes.js.map