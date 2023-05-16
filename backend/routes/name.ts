import express from 'express';
import nameController from '../controllers/nameController';

const router = express.Router();

// // localhost:3000/name/
router.get('/', nameController.getAll);
// example:
// localhost:3000/name/search?name=First%20Last
router.get('/search', nameController.getByName);
router.post('/', nameController.addOne);

export default router;
