import express from "express";
import evoucherRoute from "./evoucher.route";
import smsRoute from "./sms.route";
import downloadRoute from "./download.route";
import campaignRoute from "./campaign.route";
import luckyWheelRoute from "./luckyWheel.route";
import addressStorehouse from "./addressStorehouse.route";
import addressDelivery from "./addressDelivery.route";
import diligencePointRoute from "./diligencePoint.route";
import serviceRoute from "./service.route";

const router = express.Router();
router.use("/evoucher", evoucherRoute);
router.use("/diligencePoint", diligencePointRoute);
router.use("/sms", smsRoute);
router.use("/service", serviceRoute);
router.use("/download", downloadRoute);
router.use("/campaign", campaignRoute);
router.use("/luckywheel", luckyWheelRoute);
router.use("/address-storehouse", addressStorehouse);
router.use("/address-delivery", addressDelivery);
export default router;