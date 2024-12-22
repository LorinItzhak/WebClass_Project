
import express,{Request,Response} from 'express';
import userController from '../controllers/user_controller';

const router = express.Router();

router.post('/register', userController.register); 

router.post('/login',userController.login ); 

router.post('/logout',userController.logout  );

router.post('/refresh',userController.refresh);

export default router;
 