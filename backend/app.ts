/** @format */

import express from "express";
import search from "./src/search";
import thiefEdit from "./src/thiefEdit";
import stats from "./src/stats";
import signup from "./src/signup";
import login from "./src/login";
import token from "./src/token";
import dataImport from "./src/dataImport";
//@ts-ignore
//import serviceAccount from 'serviceProvider.json';

var admin = require("firebase-admin");

var cors = require("cors");

const port = process.env.PORT || 3000;
const app = express();

var serviceAccount = require('../serviceProvider.json');

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const auth = admin.auth();



app.use(cors());
app.set("port", port);
app.use(express.json());

app.use("/search", search);
app.use("/thiefEdit", thiefEdit);
app.use("/stats", stats);
app.use("/signup", signup);
app.use("/login", login);
app.use("/token", token);
app.use("/dataImport", dataImport);



app.listen(port, () => {
	console.log(`listening on port http://localhost:${port}`);
});

