import request from "supertest";
import initApp from "../server";
import mongoose, { set } from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";
import userModel from "../models/user_model";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await userModel.deleteMany();
  await postModel.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

const baseUrl = "/users";

type User = {
  email: string;
  password: string;
  accessToken?: string;
  refreshToken?: string;
  _id?: string;
}
const testUser: User = {
  email: "user1@test.com",
  password: "123456",
}

describe("Auth test suite", () => {
  test("Auth test registration", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).toBe(200);
  });

  test("Auth test registration no password", async () => {
    const response = await request(app).post(baseUrl + "/register").send({
      email: "sdfsadaf",
    });
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test registration email already exist", async () => {
    const response = await request(app).post(baseUrl + "/register").send(testUser);
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test login", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser._id = response.body._id;
  });



  test("Auth test login make sure tokens are diffresnt", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    expect(accessToken).not.toBe(testUser.accessToken);
    expect(refreshToken).not.toBe(testUser.refreshToken);
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;
    testUser._id = response.body._id;
  });

  test("Test token access", async () => {
    const response = await request(app).post("/posts").send({
      title: "Test title",
      content: "Test content",
      owner: "Lorin",
    });

    expect(response.statusCode).not.toBe(201);
    const response2 = await request(app).post("/posts").set({
      authorization: "JWT " + testUser.accessToken,
    }).send({
      title: "Test title",
      content: "Test content",
      owner: "Lorin",
    });
    expect(response2.statusCode).toBe(201);
  });

  test("Test token access fail", async () => {
    const response2 = await request(app).post("/posts").set({
      authorization: "JWT " + testUser.accessToken + "f",
    }).send({
      title: "Test title",
      content: "Test content",
      owner: "Lorin",
    });
    expect(response2.statusCode).not.toBe(201);
  })

  test("Test refresh token", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;
  });

  test("Test refresh token fail", async () => {
    const response = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response.statusCode).toBe(200);
    const newRefreshToken = response.body.refreshToken;

    const response2 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response2.statusCode).not.toBe(200);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: newRefreshToken,
    });
    expect(response3.statusCode).not.toBe(200);
  });


  test("Test Logout", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    const accessToken = response.body.accessToken;
    const refreshToken = response.body.refreshToken;
    testUser.accessToken = accessToken;
    testUser.refreshToken = refreshToken;

    const response2 = await request(app).post(baseUrl + "/logout").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response2.statusCode).toBe(200);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response3.statusCode).not.toBe(200);
  });

  jest.setTimeout(20000);

  test("Token expiration", async () => {
    const response = await request(app).post(baseUrl + "/login").send(testUser);
    expect(response.statusCode).toBe(200);
    testUser.accessToken = response.body.accessToken;
    testUser.refreshToken = response.body.refreshToken;

    await new Promise((resolve) => setTimeout(resolve, 12000));

    const response2 = await request(app).post("/posts").set({
      authorization: "JWT " + testUser.accessToken,
    }).send({
      title: "Test title",
      content: "Test content",
      owner: "Lorin",
    });
    expect(response2.statusCode).not.toBe(201);

    const response3 = await request(app).post(baseUrl + "/refresh").send({
      refreshToken: testUser.refreshToken,
    });
    expect(response3.statusCode).toBe(200);
    testUser.accessToken = response3.body.accessToken;
    testUser.refreshToken = response3.body.refreshToken;

    const response4 = await request(app).post("/posts").set({
      authorization: "JWT " + testUser.accessToken,
    }).send({
      title: "Test title",
      content: "Test content",
      owner: "Lorin",
    });
    expect(response4.statusCode).toBe(201);
  });
});