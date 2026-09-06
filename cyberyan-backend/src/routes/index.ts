import { Router } from "express";
import profileRoutes from "./profile.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "OK" });
});

router.use("/profiles", profileRoutes);

export default router;
