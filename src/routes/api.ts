import { Router } from "express";

export const PREFIX = "/api";
const router = Router();

router.get("/users/create", (req, res) => {
    res.send(true);
});

export default router;
