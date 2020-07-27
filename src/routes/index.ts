import { Router } from "express";
import AppRouter from "./app-router";

// Init router and path
const router = Router();

// Base Routes
router.get("/", (req, res) => {
    res.render("landing");
});

// Add sub-routes
router.use("/app", AppRouter);

// Export the base-router
export default router;
