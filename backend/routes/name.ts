import express from 'express';
import nameController from '../controllers/nameController';

const router = express.Router();

// // localhost:3000/name/
router.get('/', nameController.getAll);
// localhost:3000/name/search
router.get('/search/:name', nameController.getByName);
router.post('/', nameController.addOne);

export default router;
