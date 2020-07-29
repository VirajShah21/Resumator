import { Router } from "express";

const router = Router();

router.get("/users/create", (req, res) => {
    res.send(true);
});

export default router;
