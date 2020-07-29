import { Router } from "express";
import AppRouter from "./app-router";
import ApiRouter from "./api";

export const PREFIX = "/";

// Init router and path
const router = Router();

// Base Routes
router.get("/", (req, res) => {
    res.render("landing");
});

// Add sub-routes
router.use("/app", AppRouter);
router.use("/api", ApiRouter);

// Export the base-router
export default router;
