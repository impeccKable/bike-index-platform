/** @format */

import express from "express";
import search from "./src/search";
import thiefEdit from "./src/thiefEdit";
import stats from "./src/stats";
import signup from "./src/signup";
var cors = require("cors");

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.set("port", port);
app.use(express.json());

app.use("/search", search);
app.use("/thiefEdit", thiefEdit);
app.use("/stats", stats);
app.use("/signup", signup);

app.listen(port, () => {
	console.log(`listening on port http://localhost:${port}`);
});
