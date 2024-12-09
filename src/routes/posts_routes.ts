
import express from 'express';
const router = express.Router();
import post_ from '../controllers/post_controller';

router.post('/',post_.AddANew.bind(post_)); 
router.get('/',(req,res )=> {
    post_.getAll (req,res);
});
router.get('/:id',(req,res )=> {
    post_.getById(req,res);
});
 
router.put('/:id',(req,res)=>{
    post_.updateA (req,res);
});

export default router;
 