import { Router } from "express";
import AppRouter from "./AppRouter";
import ApiRouter from "./api";
import Logger from "@shared/Logger";
import { views } from "@shared/constants";

export const PREFIX = "/";

// Init router and path
const router = Router();

// Before any routes are handled
router.use((req, res, next) => {
    // Check if either req.query or req.body is empty
    let isEmpty = true;
    for (const query in req.query) {
        if (req.query.hasOwnProperty(query)) {
            isEmpty = false;
            break;
        }
    }
    if (isEmpty) {
        for (const param in req.body) {
            if (req.body.hasOwnProperty(param)) {
                isEmpty = false;
                break;
            }
        }
    }

    if (!isEmpty) Logger.info(`REQEST (${req.url}): ${JSON.stringify(req.body || req.query)}`);
    next();
});

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
