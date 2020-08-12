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

router.post("/add", jsonParser, (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            const certification = new Certification(
                req.body.institution,
                req.body.certification,
                req.body.details,
                req.body["exam-date"],
                session.user
            );
            certification.insertDatabaseItem((success) => {
                if (success) res.redirect(routes.dashboardCard.certification);
                else
                    res.render(views.genericError, {
                        error: "Database Error",
                        message: "Error adding certification. Please try again.",
                    });
            });
        } else {
            res.render(views.genericError, {
                error: "Session Error",
                message: "Could not find an account assocated with your session",
            });
        }
    });
});

router.post("/update", jsonParser, (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            const certification = new Certification(
                req.body.institution,
                req.body.certification,
                req.body.details,
                req.body["exam-date"],
                session.user
            );
            certification._id = req.body._id;
            certification.updateDatabaseItem((success) => {
                if (success) res.redirect(routes.dashboardCard.certification);
                else
                    res.render(views.genericError, {
                        error: "Database Error",
                        message: "Could not add your certification. Please try again in some time",
                    });
            });
        } else {
            res.render(views.genericError, {
                error: "Session Error",
                message: "Could not find an account associated with the session",
            });
        }
    });
});

export default router;
