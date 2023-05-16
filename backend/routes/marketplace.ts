import express from 'express';
import marketplaceController from '../controllers/marketplaceController';

const router = express.Router();

router.get('/', marketplaceController.getAll);

export default router;
