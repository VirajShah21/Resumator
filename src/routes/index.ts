import { Router } from "express";
import AppRouter from "./AppRouter";
import ApiRouter from "./api";
import { views } from "@shared/constants";

export const PREFIX = "/";

// Init router and path
const router = Router();

// Base Routes
router.get("/", (req, res) => {
    res.render(views.landingPage, {
        nav: "Home",
    });
});

// Add sub-routes
router.use("/app", AppRouter);
router.use("/api", ApiRouter);

// Export the base-router
export default router;
