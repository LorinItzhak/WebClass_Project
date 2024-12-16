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
const user_model_1 = __importDefault(require("../models/user_model"));
const posts_model_1 = __importDefault(require("../models/posts_model"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield user_model_1.default.deleteMany();
    yield posts_model_1.default.deleteMany();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const baseUrl = "/users";
const userInfo = {
    email: "lorinn2@icloud.com",
    password: "123456",
};
describe("user test", () => {
    test("user Registration", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/register").send(userInfo);
        expect(response.statusCode).toBe(201);
    }));
    test("user Registration no password ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/register").send({
            email: "hugiugiu",
        });
        expect(response.statusCode).not.toBe(201);
    }));
    test("user Registration email already exist ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/register").send(userInfo);
        expect(response.statusCode).not.toBe(201);
    }));
    test("user Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post(baseUrl + "/login").send(userInfo);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        const token = response.body.token;
        expect(token).toBeDefined();
        const userId = response.body._id;
        expect(userId).toBeDefined();
        userInfo.token = token;
        userInfo._id = userId;
    }));
    test("get protected API", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts").send({
            title: "test title",
            content: "test content",
            owner: userInfo._id,
        });
        expect(response.statusCode).not.toBe(201);
        const response2 = yield (0, supertest_1.default)(app).post("/posts")
            .set({ authorization: 'jwt ' + userInfo.token })
            .send({
            title: "test title",
            content: "test content",
            owner: userInfo._id,
        });
        expect(response2.statusCode).toBe(201);
    }));
    test("get protected API invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts")
            .set({ authorization: 'jwt ' + userInfo.token + '1' })
            .send({
            title: "test title",
            content: "test content",
            owner: userInfo._id,
        });
        expect(response.statusCode).not.toBe(201);
    }));
});
//# sourceMappingURL=user.test.js.map