
import express from 'express';
const router = express.Router();
import comment_ from '../controllers/comment_controllers';

router.post('/',(req,res )=> {
    comment_.AddANew(req,res);
});
router.get('/',(req,res )=> {
    comment_.getAll(req,res);
});
router.get('/:id',(req,res )=> {
    comment_.getById(req,res);
});

router.put('/:id',(req,res)=>{
    comment_.updateA(req,res);
});

export default router;
 