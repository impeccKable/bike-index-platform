/** @format */

import express from "express";
import search from "./src/search";
import thiefedit from "./src/thiefedit";
import stats from "./src/stats";
var cors = require("cors");

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.set("port", port);
app.use(express.json());

app.use("/search", search);
app.use("/thiefedit", thiefedit);
app.use("/stats", stats);

app.listen(port, () => {
	console.log(`listening on port http://localhost:${port}`);
});
