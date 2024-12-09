"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
router.post('/register', (req, res) => {
    user_controller_1.default.register(req, res);
});
router.post('/login', (req, res) => {
    user_controller_1.default.login(req, res);
});
exports.default = router;
//# sourceMappingURL=user_routes.js.map