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
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const Comments_model_1 = __importDefault(require("../models/Comments_model"));
let app;
const testUser = {
    email: "test@user.com",
    password: "123456",
};
let accessToken;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    console.log('beforeAll');
    yield Comments_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('afterAll');
    yield mongoose_1.default.connection.close();
}));
let commentId = "";
const testComment = {
    comment: "test content",
    postId: "idididid",
    owner: "lorin",
};
const invalidComment = {
    comment: "test content",
};
describe("Comments test suite", () => {
    test("Comment test get All Comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    }));
    test("test adding a new Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").send(testComment);
        expect(response.statusCode).toBe(201);
        expect(response.body.comment).toBe(testComment.comment);
        expect(response.body.postId).toBe(testComment.postId);
        expect(response.body.owner).toBe(testComment.owner);
        commentId = response.body._id;
    }));
    test("test adding invalid Comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/comments").send(invalidComment);
        expect(response.statusCode).not.toBe(201);
    }));
    test("test get all Comments after adding", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    }));
    test("test get Comment by owner", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments?owner=" + testComment.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].owner).toBe(testComment.owner);
    }));
    test("test get Comment by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(commentId);
    }));
    test("test get Comment by id fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/comments/67460dffc9211d4f36225657");
        expect(response.statusCode).toBe(404);
    }));
});
//# sourceMappingURL=comments.test.js.map