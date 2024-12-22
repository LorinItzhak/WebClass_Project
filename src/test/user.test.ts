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

const baseUrl="/users";

type UserInfo={
    email:string;
    password:string;
    accessToken?:string;
    refreshToken?:string;
    _id?:string;
}
const userInfo:UserInfo ={
    email:"lorinn2@icloud.com",
    password:"123456",
};

describe("user test", ()=> {
    test("user Registration",async ()=>{
       const response = await request(app).post(baseUrl + "/register").send(userInfo);
       expect(response.statusCode).toBe(201);
      
    });

    test("user Registration no password ",async ()=>{
        const response = await request(app).post(baseUrl+ "/register").send({
            email:"hugiugiu",
        });
        expect(response.statusCode).not.toBe(201);
       
     });

    test("user Registration email already exist ",async ()=>{
        const response = await request(app).post(baseUrl+ "/register").send(userInfo);
        expect(response.statusCode).not.toBe(201);
       
     });

    test("user Login",async ()=>{
        const response = await request(app).post(baseUrl+"/login").send(userInfo);
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        const accessToken=response.body.accessToken;
        const refreshToken=response.body.refreshToken;
        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
        const userId=response.body._id;
        expect(userId).toBeDefined();
        userInfo.accessToken=accessToken;
        userInfo.refreshToken=refreshToken;
        userInfo._id=userId;
        
    });

    test("make sure two access tokens are different",async ()=>{
        const response = await request(app).post("/users/login").send({
            email:userInfo.email,
            password:userInfo.password
        });
        expect(response.body.accessToken).not.toEqual(userInfo.accessToken);

    });

    test("get protected API",async ()=>{
        const response = await request(app).post("/posts").send({
            title:"test title",
            content:"test content",
            owner:userInfo._id,
        });
        expect(response.statusCode).not.toBe(201);

        const response2 = await request(app).post("/posts")
        .set({ authorization: 'jwt ' + userInfo.accessToken})
        .send({
            title:"test title",
            content:"test content",
            owner:userInfo._id,
        });
        expect(response2.statusCode).toBe(201);
    });


    test("get protected API invalid token",async ()=>{
        const response = await request(app).post("/posts") 
        .set({ authorization: 'jwt ' + userInfo.accessToken+'1'})
        .send({
            title:"test title",
            content:"test content",
            owner:userInfo._id,
        });
        expect(response.statusCode).not.toBe(201);

    });

    test("Refresh token",async ()=>{
        const response = await request(app).post("/users/refresh").send({
            refreshToken:userInfo.refreshToken,
        });
        expect(response.statusCode).toBe(200);
        // const accessToken=response.body.accessToken;
        // const refreshToken=response.body.refreshToken;
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
        userInfo.accessToken=response.body.accessToken;
        userInfo.refreshToken=response.body.refreshToken;
    });

    test("Logout- invalidate refresh token",async ()=>{
        const response = await request(app).post("/users/logout").send({
            refreshToken:userInfo.refreshToken,
        });
        expect(response.statusCode).toBe(200);

        const response2 = await request(app).post("/users/refresh").send({
            refreshToken:userInfo.refreshToken,
        });
        expect(response2.statusCode).not.toBe(200);

    });

    test("refresh token multiple times",async ()=>{
        //login - get a refresh token
        const response = await request(app).post("/users/login").send({
            email:userInfo.email,
            password:userInfo.password,
        });
        expect(response.statusCode).toBe(200);
        userInfo.accessToken=response.body.accessToken;
        userInfo.refreshToken=response.body.refreshToken;
        //first time use the refresh token and get a new refresh token
        const response2 = await request(app).post("/users/refresh").send({
            refreshToken:userInfo.refreshToken,
        });
        expect(response2.statusCode).toBe(200);
        const newRefreshToken=response2.body.refreshToken;
        //second time use the old refresh token and expect to fail
        const response3 = await request(app).post("/users/refresh").send({
            refreshToken:newRefreshToken
        });
        expect(response3.statusCode).not.toBe(200);
        //try to use the new refresh token and expect to fail
        const response4 = await request(app).post("/users/refresh").send({
            refreshToken:newRefreshToken,
        });
        expect(response4.statusCode).not.toBe(200);
       
    });
        
});
