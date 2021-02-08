import express from "express";
import ViewRoute from "./view.route";
const router = express.Router();
router.use("/", ViewRoute);
export default router;
