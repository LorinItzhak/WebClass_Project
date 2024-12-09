
import express from 'express';
const router = express.Router();
import post_ from'../controllers/post_controller';

router.post('/',post_.AddANewPost);
router.get('/',(req,res)=>{
    post_.getAllPost(req,res);
});
router.get('/:id',(req,res)=>{
    post_.getPostById(req,res);
});

router.put('/:id', (req,res)=>{
    post_.updateAPost(req,res);
});


export default  router;