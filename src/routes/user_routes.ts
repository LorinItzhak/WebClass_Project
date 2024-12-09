
import express,{Request,Response} from 'express';
const router = express.Router();
import userController from '../controllers/user_controller';


router.post('/register',(req:Request, res:Response) => {
    userController.register(req,res);
}); 

router.post('/login',(req:Request, res:Response) => {
    userController.login(req,res);
}); 

export default router;
 