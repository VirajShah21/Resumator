import { Router } from "express";
import BodyParser from "body-parser";
import Account from "@entities/Account";
import Session from "@entities/Session";
import WorkExperience from "@entities/WorkExperience";
import Education from "@entities/Education";
import { ObjectId } from "mongodb";
import AccountRouter from "./account";
import Skill from "@entities/Skill";
import Certification from "@entities/Certification";

const router = Router();
const jsonParser = BodyParser.json();

router.post("/add", (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            Account.loadFromDatabase(session.user, (account) => {
                if (account) {
                    const education = new Education(
                        account.email,
                        req.body.institution,
                        req.body.level,
                        req.body.degree,
                        req.body["start-date"],
                        req.body["end-date"],
                        req.body.gpa,
                        req.body.description
                    );
                    education.insertDatabaseItem(() => {
                        res.redirect("back");
                    });
                }
            });
        } else {
            res.render("UnknownError");
        }
    });
});

router.post("/update", (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            const education = new Education(
                session.user,
                req.body.institution,
                req.body.level,
                req.body.degree,
                req.body.start,
                req.body.end,
                req.body.gpa,
                req.body.description
            );

            if (req.body.delete === "on") {
                education.deleteDatabaseItem(() => {
                    res.redirect("/app/dashboard#education-card");
                });
            } else {
                education._id = new ObjectId(req.body._id);
                education.updateDatabaseItem(() => {
                    res.redirect("/app/dashboard#education-card");
                });
            }
        } else {
            res.render("UnknownError");
        }
    });
});

export default router;
