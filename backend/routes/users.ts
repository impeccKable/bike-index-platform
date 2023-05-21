/** @format */

import express from "express";
import usersController from "../controllers/usersController";

const router = express.Router();

router.get("/", usersController.getAll); //no db yet
router.get("/search", usersController.getByEmail); // no db yet
router.delete("/", usersController.deleteUser);
router.put("/", usersController.changeUserInfo);
router.post("/", usersController.addFake);

export default router;
