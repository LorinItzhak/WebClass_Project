import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import userModel from "../models/user_model";
import e, { Express } from "express";
import PostModel from "../models/posts_model";

let app:Express;

beforeAll(async()=>{
     app= await initApp();
     await userModel.deleteMany();
        await PostModel.deleteMany(); 
});

afterAll(async()=>{
    await mongoose.connection.close();
     
});

const baseUrl="/user";

type UserInfo={
    email:string;
    password:string;
    token?:string;
    _id?:string;
}
const userInfo:UserInfo ={
    email:"lorinn2@icloud.com",
    password:"123456",
};

describe("user test", ()=> {
    test("user Registration",async ()=>{
       const response = await request(app).post(baseUrl + "/register").send(userInfo);
       expect(response.statusCode).toBe(200);
      
    });

    test("user Registration no password ",async ()=>{
        const response = await request(app).post(baseUrl+ "/register").send({
            email:"hugiugiu",
        });
        expect(response.statusCode).not.toBe(200);
       
     });

    test("user Registration email already exist ",async ()=>{
        const response = await request(app).post(baseUrl+ "/register").send(userInfo);
        expect(response.statusCode).not.toBe(200);
       
     });

    test("user Login",async ()=>{
        const response = await request(app).post("/user/login").send(userInfo);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        const token=response.body.token;
        expect(token).toBeDefined();
        const userId=response.body._id;
        expect(userId).toBeDefined();
        userInfo.token=token;
        userInfo._id=userId;
        
    });

    test("get protected API",async ()=>{
        const response = await request(app).post("/posts").send({
            title:"test title",
            content:"test content",
            owner:userInfo._id,
        });
        expect(response.statusCode).not.toBe(201);

        const response2 = await request(app).post("/posts")
        .set({ authorization: 'jwt ' + userInfo.token})
        .send({
            title:"test title",
            content:"test content",
            owner:userInfo._id,
        });
        expect(response2.statusCode).toBe(201);
    });


    test("get protected API invalid token",async ()=>{
        const response = await request(app).post("/posts") 
        .set({ authorization: 'jwt ' + userInfo.token+'1'})
        .send({
            title:"test title",
            content:"test content",
            owner:userInfo._id,
        });
        expect(response.statusCode).not.toBe(201);

    });
});
