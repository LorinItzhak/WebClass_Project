import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import likeController from '../controllers/like_controllers';
import { authMiddleware } from '../controllers/user_controller';

/**
* @swagger
* tags:
*   name: Likes
*   description: The Likes API
*/

/**
* @swagger
* components:
*   schemas:
*     Like:
*       type: object
*       required:
*         - postId
*         - owner
*       properties:
*         postId:
*           type: string
*           description: The ID of the post that was liked
*         owner:
*           type: string
*           description: The ID of the user who liked the post
*       example:
*         postId: '60d0fe4f5311236168a109cb'
*         owner: '60d0fe4f5311236168a109ca'
*/

/**
* @swagger
* /likes:
*   post:
*     summary: Add a new like
*     description: Add a new like to the database
*     tags: [Likes]
*     security:
*       - bearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Like'
*     responses:
*       201:
*         description: Like added successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Like'
*       400:
*         description: Bad request
*       500:
*         description: Internal server error
*/
router.post('/', authMiddleware, (req: Request, res: Response) => {
    likeController.AddANew(req, res);
});

/**
* @swagger
* /likes:
*   get:
*     summary: Get all likes
*     description: Retrieve all likes from the database
*     tags: [Likes]
*     responses:
*       200:
*         description: A list of likes
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Like'
*       500:
*         description: Internal server error
*/
router.get('/', (req: Request, res: Response) => {
    likeController.getAll(req, res);
});

/**
* @swagger
* /likes/{id}:
*   get:
*     summary: Get a like by ID
*     description: Retrieve a single like by its ID
*     tags: [Likes]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The like ID
*     responses:
*       200:
*         description: A single like
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Like'
*       404:
*         description: Like not found
*       500:
*         description: Internal server error
*/
router.get('/:id', (req: Request, res: Response) => {
    likeController.getById(req, res);
});

/**
* @swagger
* /likes/{id}:
*   put:
*     summary: Update a like
*     description: Update a like by its ID
*     tags: [Likes]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The like ID
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Like'
*     responses:
*       200:
*         description: Like updated successfully
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Like'
*       400:
*         description: Bad request
*       404:
*         description: Like not found
*       500:
*         description: Internal server error
*/
router.put('/:id', (req: Request, res: Response) => {
    likeController.updateA(req, res);
});

/**
* @swagger
* /likes/{id}:
*   delete:
*     summary: Delete a like
*     description: Delete a like by its ID
*     tags: [Likes]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The like ID
*     responses:
*       200:
*         description: Like deleted successfully
*       404:
*         description: Like not found
*       500:
*         description: Internal server error
*/
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    likeController.deleteById(req, res);
});

export default router;