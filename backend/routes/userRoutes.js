import express from 'express';
import { addUser, getAllUsers, refreshUser, deleteUser, refreshAllUsers } from '../controllers/userController.js';

const router = express.Router();

router.post('/users', addUser);
router.get('/users', getAllUsers);
router.put('/users/refresh-all', refreshAllUsers); // Add this BEFORE the :username route
router.put('/users/:username/refresh', refreshUser);
router.delete('/users/:username', deleteUser);

export default router;
