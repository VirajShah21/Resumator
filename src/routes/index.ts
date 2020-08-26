import { Router } from "express";
import AppRouter from "./AppRouter";
import ApiRouter from "./api";
import { views } from "@shared/constants";
import AccountSessionTransformer from "@transformers/AccountSessionTransformer";
import logger from "@shared/Logger";

export const PREFIX = "/";

// Init router and path
const router = Router();

// Base Routes
router.get("/", (req, res) => {
    if (req.cookies.session) {
        AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
            if (accountSession && accountSession.account) {
                res.redirect("/app/dashboard");
            } else {
                res.redirect("/app/account");
            }
        });
    } else {
        res.render(views.landingPage, {
            nav: "Home",
        });
    }
});

// Add sub-routes
router.use("/app", AppRouter);
router.use("/api", ApiRouter);

// Export the base-router
export default router;
