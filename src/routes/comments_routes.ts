
import express,{Request,Response,NextFunction} from 'express';
const router = express.Router();
import comment_ from '../controllers/comment_controllers';
import { authMiddleware } from '../controllers/user_controller';

router.post('/',authMiddleware,(req:Request,res:Response )=> {
    comment_.AddANew(req,res);
});
router.get('/',(req:Request,res:Response )=> {
    comment_.getAll(req,res);
});
router.get('/:id',(req:Request,res:Response )=> {
    comment_.getById(req,res);
});

router.put('/:id',(req:Request,res:Response)=>{
    comment_.updateA(req,res);
});

router.delete('/:id',authMiddleware,(req:Request,res:Response)=>{
    comment_.deleteComment(req,res);
}); 

export default router;
 