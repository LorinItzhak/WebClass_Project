import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from"../models/posts_model";
import { Express } from "express";

let app : Express;

beforeAll(async()=>{
     app= await initApp();
    console.log('beforeAll');
     await postModel.deleteMany();
});

afterAll(async()=>{
    console.log('afterAll');
    await mongoose.connection.close();
     
});

let postId="";
const testPost={
    title: "test title",
    content: "test content",
    owner: "lorin",
};

const invalidPost={
    title: "test title",
    content: "test content",
};

describe("Posts test suite", ()=> {
    test("post test get All posts",async ()=>{
       const response = await request(app).get("/posts");
       expect(response.statusCode).toBe(200);
       expect(response.body).toHaveLength(0);
    });


test("test adding a new post", async () => {
    const response = await request(app).post("/posts").send(testPost);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(testPost.title);
    expect(response.body.content).toBe(testPost.content);
    expect(response.body.owner).toBe(testPost.owner);
    postId=response.body._id;
});


test("test adding invalid post", async () => {
    const response = await request(app).post("/posts").send(invalidPost);

    expect(response.statusCode).not.toBe(201); 
});


test("test get all posts after adding", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);   
});


test("test get post by owner", async () => {
    const response = await request(app).get("/posts?owner="+testPost.owner);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].owner).toBe(testPost.owner);
});


    test("test get post by id", async()=>{
        const response = await request(app).get("/posts/"+ postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
        }) ;

        test("test get post by id fail", async()=>{
            const response = await request(app).get("/posts/"+ postId +5);
            expect(response.statusCode).toBe(404);
            }) ;
    });
