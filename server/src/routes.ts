import { Router } from 'express';
import { signIn, signUp } from './controllers/user.controller';

const router = Router();

router.post('/register', signUp);
router.get('/login', signIn);

export default router;
