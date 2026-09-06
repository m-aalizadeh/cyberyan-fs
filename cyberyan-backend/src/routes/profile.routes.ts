import { Router } from "express";
import { profileController } from "../controllers/profile.controller";

const router = Router();

// IMPORTANT: /search and /filters/meta must be declared before /:id,
// otherwise Express would treat "search" or "filters" as an :id value.
router.get("/search", profileController.search);
router.get("/filters/meta", profileController.filterMeta);
router.get("/:id", profileController.getById);

export default router;
