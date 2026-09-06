import { Router } from "express";
import { profileController } from "../controllers/profile.controller";

const router = Router();

router.get("/search", profileController.search);
router.get("/filters/meta", profileController.filterMeta);
router.get("/:id", profileController.getById);

export default router;
