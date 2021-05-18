import express from "express";
import apis from "./apis";
import views from "./views";
import Actions from './actions';

const router = express.Router();

router.use("/api", apis);
router.use("/", views);

Actions.map(({ route, action }) => {
    router.use(route, action);
})


export default router;
