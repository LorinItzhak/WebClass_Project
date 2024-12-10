import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentModel from "../models/Comments_model";
import { Express } from "express";

let app:Express;

const testUser = {
    email: "test@user.com",
    password: "123456",
  }
  
  let accessToken: string;
  


beforeAll(async()=>{
     app= await initApp();
    console.log('beforeAll');
     await commentModel.deleteMany();
});

afterAll(async()=>{
    console.log('afterAll');
    await mongoose.connection.close();
     
});

let commentId="";
const testComment={
    comment: "test content",
    postId: "idididid",
    owner: "lorin",
};

const invalidComment={
    comment: "test content",
};

describe("Comments test suite", ()=> {
    test("Comment test get All Comments",async ()=>{
       const response = await request(app).get("/comments");
       expect(response.statusCode).toBe(200);
       expect(response.body).toHaveLength(0);
    });


test("test adding a new Comment", async () => {
    const response = await request(app).post("/comments").send(testComment);

    expect(response.statusCode).toBe(201);
    expect(response.body.comment).toBe(testComment.comment);
    expect(response.body.postId).toBe(testComment.postId);
    expect(response.body.owner).toBe(testComment.owner);
    commentId=response.body._id;
});


test("test adding invalid Comment", async () => {
    const response = await request(app).post("/comments").send(invalidComment);

    expect(response.statusCode).not.toBe(201); 
});


test("test get all Comments after adding", async () => {
    const response = await request(app).get("/comments");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);   
});


test("test get Comment by owner", async () => {
    const response = await request(app).get("/comments?owner="+testComment.owner);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].owner).toBe(testComment.owner);
});


    test("test get Comment by id", async()=>{
        const response = await request(app).get("/comments/"+ commentId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(commentId );
        }) ;

        test("test get Comment by id fail", async()=>{
            const response = await request(app).get("/comments/67460dffc9211d4f36225657");
            expect(response.statusCode).toBe(404);
            }) ;
    });
