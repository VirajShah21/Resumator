import { Router } from "express";

// Init router and path
const router = Router();

// Base Routes
router.get("/", (req, res) => {
    res.render("landing");
});

// Add sub-routes
// router.use('/users', UserRouter);

// Export the base-router
export default router;
