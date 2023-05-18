import express from 'express';
import phoneController from '../controllers/phoneController';

const router = express.Router();

router.get('/', phoneController.getAll);
// the "+" becomes "%2B" in url
// example:
// http://localhost:3000/phone/search?phone=%2B161056606341
router.get('/search', phoneController.getByPhoneNum);
router.post('/', phoneController.addOne);

export default router;
