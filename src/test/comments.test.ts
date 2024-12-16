import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentModel from "../models/Comments_model";
import { Express } from "express";
import userModel from "../models/user_model";

let app:Express;

const testUser = {
    email: "test@user.com",
    password: "123456",
}
  
const testComment={
    comment: "test content",
    postId: "idididid",
    owner: null as string | null,
};

let accessToken: string;
let userId: string;
let commentId: string;


beforeAll(async()=>{
     app= await initApp();
     console.log('beforeAll');
     await commentModel.deleteMany();
     await userModel.deleteMany();
     // Register user
       const registerResponse = await request(app)
         .post("/users/register")
         .send(testUser);
       expect(registerResponse.statusCode).toBe(201);
     
       // Login user
       const loginResponse = await request(app)
         .post("/users/login")
         .send(testUser);
       expect(loginResponse.statusCode).toBe(200);
     
       accessToken = loginResponse.body.token;
       userId = loginResponse.body._id;
       testComment.owner = userId;
});

afterAll(async()=>{
    console.log('afterAll');
    await mongoose.connection.close();
     
});



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
    const response = await request(app).post("/comments").set({
        authorization: "Bearer " + accessToken,
    }).send(testComment);

    expect(response.statusCode).toBe(201);
    expect(response.body.comment).toBe(testComment.comment);
    expect(response.body.postId).toBe(testComment.postId);
    expect(response.body.owner).toBe(testComment.owner);
    commentId=response.body._id;
});


test("test adding invalid Comment", async () => {
    const response = await request(app).post("/comments").set({
        authorization: "Bearer " + accessToken,
    }).send(invalidComment);

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
