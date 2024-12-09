import express from 'express';
const router = express.Router();
import Comment_ from '../controllers/comment_controllers';

router.post('/',Comment_.AddANewComment);
router.get('/',(req,res)=>{
    Comment_.getAllComments(req,res);
}); 
router.get('/',(req,res)=>{
    Comment_.getCommentById(req,res);
}); 

router.delete('/:id',(req,res)=>{
    Comment_.deleteComment(req,res);
});

router.put('/:id', (req,res)=>{
    Comment_.updateComment(req,res);
});


export default  router;