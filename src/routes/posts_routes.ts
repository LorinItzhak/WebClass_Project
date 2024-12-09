
import express,{Request,Response,NextFunction} from 'express';
const router = express.Router();
import post_ from '../controllers/post_controller';
import {authMiddleware} from '../controllers/user_controller';

router.post('/',authMiddleware,post_.AddANew.bind(post_)); 

router.get('/',(req,res )=> {
    post_.getAll (req,res);
});
router.get('/:id',(req,res )=> {
    post_.getById(req,res);
});
 
router.put('/:id',(req,res)=>{
    post_.updateA (req,res);
});

// router.delete("/:id", authMiddleware, (req: Request, res: Response) => {
//     post_.deleteItem(req, res);
// });

export default router;
 