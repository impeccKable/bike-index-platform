import express from "express";
import statsController from "../controllers/statsController";

const router = express.Router();

router.get("/", statsController.getAll);

export default router;
