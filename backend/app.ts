/** @format */

import express from "express";
import index from "./routes/index";
import name from "./routes/name";
import marketplace from "./routes/marketplace";
import phone from "./routes/phone";
import email from "./routes/email";
import address from "./routes/address";
import user from "./routes/users";

const port = process.env.PORT || 3000;

const app = express();

app.set("port", port);

app.use(express.json());

app.use("/", index);
app.use("/name", name);
app.use("/marketplace", marketplace);
app.use("/phone", phone);
app.use("/email", email);
app.use("/address", address);
app.use("/user", user);

app.listen(port, () => {
	console.log(`listening on port http://localhost:${port}`);
});
