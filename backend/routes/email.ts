import express from "express";
import emailController from "../controllers/emailController";

const router = express.Router();

router.get("/", emailController.getAll);
router.get("/search", emailController.getByEmail);
router.post("/", emailController.addOne);

export default router;
