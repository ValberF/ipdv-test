import { Router } from 'express';
import RoleController from '../../controllers/RoleController';
import authenticateToken from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, RoleController.getAll);
router.get('/:id', authenticateToken, RoleController.getById);
router.post('/', authenticateToken, RoleController.create);
router.put('/:id', authenticateToken, RoleController.update);
router.delete('/:id', authenticateToken, RoleController.delete);

export default router;