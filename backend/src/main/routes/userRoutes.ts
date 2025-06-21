import { Router } from 'express';
import UserController from '../../controllers/UserController';
import authenticateToken from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, UserController.getAll);
router.get('/me', authenticateToken, UserController.getMe);
router.get('/:id', authenticateToken, UserController.getById);
router.post('/', authenticateToken, UserController.create);
router.put('/:id', authenticateToken, UserController.update);
router.delete('/:id', authenticateToken, UserController.delete);

export default router;