"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const posts_routes_1 = __importDefault(require("./routes/posts_routes"));
const comments_routes_1 = __importDefault(require("./routes/comments_routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const initApp = () => {
    return new Promise((resolve, reject) => {
        const db = mongoose_1.default.connection;
        db.on("error", (err) => {
            console.log(err);
        });
        db.once("open", () => {
            console.log("connected to MongoDB");
            // db.on("error", console.error.bind(console,"connection error:"));
            // db.once("open",function(){ console.log("connected to the database")});
        });
        if (process.env.DB_CONNECT === undefined) {
            console.error("DB_CONNECT is not set");
            reject();
        }
        else {
            mongoose_1.default.connect(process.env.DB_CONNECT).then(() => {
                console.log('initApp finish');
                app.use(body_parser_1.default.json());
                app.use(body_parser_1.default.urlencoded({ extended: true }));
                app.use("/posts", posts_routes_1.default);
                app.use("/comment", comments_routes_1.default);
                app.get("/about", (req, res) => {
                    res.send("About page");
                });
                resolve(app);
            });
        }
    });
};
exports.default = initApp;
//# sourceMappingURL=server.js.map