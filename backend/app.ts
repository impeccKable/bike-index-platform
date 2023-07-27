import express from 'express';
import search from './src/search';
import thiefEdit from './src/thiefEdit';
import stats from './src/stats';
import signup from './src/signup';
import login from './src/login';
import token from './src/token';
import dataImport from './src/dataImport';
//@ts-ignore
//import serviceAccount from 'serviceProvider.json';

var admin = require('firebase-admin');

var cors = require('cors');

const port = process.env.PORT || 3000;
const app = express();
const router = express.Router();

var serviceAccount = require('../serviceProvider.json');

const firebase = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();

app.use(cors());
app.set('port', port);
app.use(express.json());

router.use('/search', search);
router.use('/thiefEdit', thiefEdit);
router.use('/stats', stats);
router.use('/signup', signup);
router.use('/login', login);
router.use('/token', token);
router.use('/dataImport', dataImport);

app.use('/api', router);

app.listen(port, () => {
	console.log(`listening on port http://localhost:${port}`);
});
