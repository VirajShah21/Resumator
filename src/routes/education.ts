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
import { views, routes } from "@shared/constants";

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
                        res.redirect(routes.dashboardCard.education);
                    });
                } else {
                    res.render(views.genericError, {
                        error: "Account Issue",
                        message: "There was a problem loading your account. Please sign out and log back in.",
                    });
                }
            });
        } else {
            res.render(views.unknownError);
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
                    res.redirect(routes.dashboardCard.education);
                });
            } else {
                education._id = new ObjectId(req.body._id);
                education.updateDatabaseItem(() => {
                    res.redirect(routes.dashboardCard.education);
                });
            }
        } else {
            res.render(views.unknownError);
        }
    });
});

export default router;
