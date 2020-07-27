import { Router } from "express";

const router = Router();

router.get("/resumeinfo", (req, res) => {
    res.render("resume-info");
});

export default router;
