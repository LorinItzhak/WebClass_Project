import express, { Request, Response } from 'express';
import userController from '../controllers/user_controller';
const router = express.Router();

/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - email
*         - password
*       properties:
*         email:
*           type: string
*           description: The user email
*         password:
*           type: string
*           description: The user password
*       example:
*         email: 'bob@gmail.com'
*         password: '123456'
*/

/**
* @swagger
* /users/register:
*   post:
*     summary: Register a new user
*     description: Register a new user with email and password
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       201:
*         description: Registration success, return the new user
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       400:
*         description: Bad request, invalid input
*       500:
*         description: Internal server error
*/
router.post('/register', userController.register);

/**
* @swagger
* /users/login:
*   post:
*     summary: User login
*     description: Authenticates a user and returns access and refresh tokens.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*                 example: user@example.com
*               password:
*                 type: string
*                 example: password123
*     responses:
*       200:
*         description: Successful login
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 accessToken:
*                   type: string
*                   description: JWT access token
*                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*                 refreshToken:
*                   type: string
*                   description: JWT refresh token
*                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*                 _id:
*                   type: string
*                   example: 60d0fe4f5311236168a109ca
*       400:
*         description: Incorrect email or password / Error generating tokens
*         content:
*           application/json:
*             schema:
*               type: string
*               example: incorrect email or password
*/
router.post('/login', userController.login);

/**
* @swagger
* /users/logout:
*   post:
*     summary: User logout
*     description: Logs out a user by invalidating the refresh token.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               refreshToken:
*                 type: string
*                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*     responses:
*       200:
*         description: Successful logout
*         content:
*           application/json:
*             schema:
*               type: string
*               example: logged out
*       400:
*         description: Error during logout
*         content:
*           application/json:
*             schema:
*               type: string
*               example: error
*/
router.post('/logout', userController.logout);

/**
* @swagger
* /users/refresh:
*   post:
*     summary: Refresh tokens
*     description: Refreshes the access and refresh tokens.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               refreshToken:
*                 type: string
*                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*     responses:
*       200:
*         description: Tokens refreshed successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 accessToken:
*                   type: string
*                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*                 refreshToken:
*                   type: string
*                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
*                 _id:
*                   type: string
*                   example: 60d0fe4f5311236168a109ca
*       400:
*         description: Error during token refresh
*         content:
*           application/json:
*             schema:
*               type: string
*               example: error
*/
router.post('/refresh', userController.refresh);

export default router;