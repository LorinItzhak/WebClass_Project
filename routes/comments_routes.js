const express= require('express');
const router = express.Router();
const Comment_ = require('../controllers/comment_controllers');

router.post('/',Comment_.AddANewComment);
router.get('/',Comment_.getAllComments);
router.get('/:id',Comment_.getCommentById);
router.delete('/:id', Comment_.deleteComment);
router.put('/:id', Comment_.updateComment);


module.exports= router;