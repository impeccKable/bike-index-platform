// import express from 'express';
// import { nameController } from '../controllers/nameController';
import * as express from 'express';
// import router from 'express.Router';
import nameController from '../controllers/nameController';

export const name = (app: express.Application) => {
  app.get('/', nameController.getAll);
  app.get('/search/:name', nameController.getByName);
};

// const router = express.Router();

// // localhost:3000/name/
// router.get('/', nameController.getAll);

// // localhost:3000/name/search
// router.get('/search/:name', nameController.getByName);

// // localhost:3000/name/
// // router.post('/', nameController.addOne);

// export default router;
