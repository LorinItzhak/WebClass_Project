import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from"../models/posts_model";
import { Express } from "express";

let app:Express;

const testUser = {
    email: "test@user.com",
    password: "123456",
  }
  let accessToken: string;
  var postId = "";
  
  const testPost = {
    title: "Test title",
    content: "Test content",
    owner: "Eliav",
  };


beforeAll(async()=>{
     app= await initApp();
     await postModel.deleteMany();
     const response = await request(app).post("/user/register").send(testUser);
     const response2 = await request(app).post("/user/login").send(testUser);
     expect(response2.statusCode).toBe(200);
     accessToken = response2.body.token;
     testPost.owner = response2.body._id;
});

afterAll(async()=>{
    await mongoose.connection.close();
     
});

const invalidPost={
    content: "test content",
};

describe("Posts test suite", ()=> {
    test("post test get All posts",async ()=>{
       const response = await request(app).get("/posts");
       expect(response.statusCode).toBe(200);
       expect(response.body).toHaveLength(0);
    });


    test("Test Addding new post", async () => {
        const response = await request(app).post("/posts").set({
          authorization: "JWT " + accessToken,
        }).send(testPost);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(testPost.title);
        expect(response.body.content).toBe(testPost.content);
        postId = response.body._id;
      });


      test("Test Addding invalid post", async () => {
        const response = await request(app).post("/posts").set({
          authorization: "JWT " + accessToken,
        }).send(invalidPost);
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
