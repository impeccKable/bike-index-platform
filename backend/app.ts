/** @format */

import express from "express";
import search from "./src/routes/search";
import thiefEdit from "./src/routes/thiefEdit";
import userList from "./src/routes/user";
import stats from "./src/routes/stats";
import signup from "./src/routes/signup";
import login from "./src/routes/login";
import token from "./src/routes/token";
import thiefDataImport from "./src/routes/thiefDataImport";
import thiefDataExport from "./src/routes/thiefDataExport";
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

router.use("/search", search);
router.use("/thief", thiefEdit);
router.use(["/users", "/user"], userList);
router.use("/stats", stats);
router.use("/signup", signup);
router.use("/login", login);
router.use("/token", token);
router.use("/thiefDataImport", thiefDataImport);
router.use("/thiefDataExport", thiefDataExport);

app.use("/api", router);

app.use('/api', router);

app.listen(port, () => {
	console.log(`listening on port http://localhost:${port}`);
});
