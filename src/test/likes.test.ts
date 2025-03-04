import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import likeModel from "../models/likes_model";
import userModel from "../models/user_model";
import postModel from "../models/posts_model";
import { Express } from "express";

let app: Express;

type User = {
    email: string;
    password: string;
    accessToken?: string;
    refreshToken?: string;
    _id?: string;
};

const testUser: User = {
    email: "user1@test.com",
    password: "123456",
};

const testLike = {
    postId: "", // Will be set dynamically after creating a post
    owner: null as string | null,
};

let accessToken: string;
let userId: string;
let likeId: string;
let postId: string; // Added for postId to create like under a valid post

beforeAll(async () => {
    app = await initApp();
    console.log('beforeAll');
    await likeModel.deleteMany();
    await userModel.deleteMany();
    await postModel.deleteMany();
    
    // Register user
    const registerResponse = await request(app)
        .post("/users/register")
        .send(testUser);
       // הוסף לוג זה

    expect(registerResponse.statusCode).toBe(201);

    // Login user
    const loginResponse = await request(app)
        .post("/users/login")
        .send(testUser);
    expect(loginResponse.statusCode).toBe(200);
    
    // Check if the token is returned under 'token' or 'accessToken'
    accessToken = loginResponse.body.token || loginResponse.body.accessToken;
    expect(accessToken).toBeDefined(); // Ensure that token exists
    
    userId = loginResponse.body._id;
    
    // Create a post to link to the like
    const postResponse = await request(app)
        .post("/posts")
        .set({
            authorization: "Bearer " + accessToken,
        })
        .send({ title: "Test Post", content: "Content for post" });
    expect(postResponse.statusCode).toBe(201);
    postId = postResponse.body._id;
    
    // Set owner for test like
    testLike.owner = userId;
    testLike.postId = postId; // Set valid postId for like
});

afterAll(async () => {
    console.log('afterAll');
    await mongoose.connection.close();
});

const invalidLike = {
    postId: "", // Invalid postId (empty)
};

describe("Likes test suite", () => {
    test("Like test get All Likes", async () => {
        const response = await request(app).get("/likes");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    test("test adding a new Like", async () => {
        const response = await request(app)
            .post("/likes")
            .set({
                authorization: "Bearer " + accessToken,
            })
            .send(testLike);

        expect(response.statusCode).toBe(201);
        expect(response.body.postId).toBe(testLike.postId);
        expect(response.body.owner).toBe(testLike.owner);
        likeId = response.body._id;
    });

    test("test adding invalid Like", async () => {
        const response = await request(app)
            .post("/likes")
            .set({
                authorization: "Bearer " + accessToken,
            })
            .send(invalidLike);

        expect(response.statusCode).not.toBe(201);
    });

    test("test get all Likes after adding", async () => {
        const response = await request(app).get("/likes");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    test("test get Like by owner", async () => {
        const response = await request(app).get("/likes?owner=" + testLike.owner);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].owner).toBe(testLike.owner);
    });

    test("test get Like by id", async () => {
        const response = await request(app).get("/likes/" + likeId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(likeId);
    });

    test("test get Like by id fail", async () => {
        const response = await request(app).get("/likes/67460dffc9211d4f36225657");
        expect(response.statusCode).toBe(404);
    });

    test("test update Like by id", async () => {
        const updatedLike = {
            postId: postId,
        };
        const response = await request(app)
            .put("/likes/" + likeId)
            .set({
                authorization: "Bearer " + accessToken,
            })
            .send(updatedLike);
        expect(response.statusCode).toBe(200);
        expect(response.body.postId).toBe(updatedLike.postId);
    });

    test("test update Like by id fail", async () => {
        const invalidId = new mongoose.Types.ObjectId().toString();
        const updatedLike = {
            postId: postId,
        };
        const response = await request(app)
            .put("/likes/" + invalidId)
            .set({
                authorization: "Bearer " + accessToken,
            })
            .send(updatedLike);
        expect(response.statusCode).toBe(404);
    });

    test("test delete Like by id", async () => {
        const response = await request(app)
            .delete("/likes/" + likeId)
            .set({
                authorization: "Bearer " + accessToken,
            });
        expect(response.statusCode).toBe(200);
    });

    test("test delete Like by id fail", async () => {
        const invalidId = new mongoose.Types.ObjectId().toString();
        const response = await request(app)
            .delete("/likes/" + invalidId)
            .set({
                authorization: "Bearer " + accessToken,
            });
        expect(response.statusCode).toBe(404);
    });
});