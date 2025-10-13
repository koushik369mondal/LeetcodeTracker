import express from 'express';
import { addUser, getAllUsers, refreshUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/users', addUser);
router.get('/users', getAllUsers);
router.put('/users/:username/refresh', refreshUser);
router.delete('/users/:username', deleteUser);

export default router;
