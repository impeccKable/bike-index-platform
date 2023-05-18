import express from "express";
import addressController from "../controllers/addressController";

const router = express.Router();

router.get("/", addressController.getAll);
router.get("/street", addressController.getByStreet);
router.get("/city", addressController.getByCity);
router.get("/state", addressController.getByState);
router.get("/zipcode", addressController.getByZipcode);
router.post("/", addressController.addOne);

export default router;
