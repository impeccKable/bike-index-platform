import express from 'express';
import marketplaceController from '../controllers/marketplaceController';

const router = express.Router();

router.get('/', marketplaceController.getAll);
router.get('/search', marketplaceController.getByLink);
// router.post('/', marketplaceController.allOne);

export default router;
