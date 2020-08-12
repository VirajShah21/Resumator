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
            const skill = new Skill(req.body.skill, req.body.proficiency, session.user);

            if (req.body.delete === "on") {
                skill.deleteDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.skills);
                    else
                        res.render(views.genericError, {
                            error: "Database Error",
                            message: "Could not delete this skill. Please try again in some time.",
                        });
                });
            } else {
                skill.insertDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.skills);
                    else
                        res.render(views.genericError, {
                            error: "Database Error",
                            message: "Could not add your skill. Please try again in some time.",
                        });
                });
            }
        } else {
            res.render(views.genericError, {
                error: "Session Error",
                message: "Could not find an account associated with the session.",
            });
        }
    });
});

router.post("/update", jsonParser, (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            const skill = new Skill(req.body.skill, req.body.proficiency, session.user);
            skill._id = new ObjectId(req.body._id);
            skill.updateDatabaseItem((success) => {
                if (success) res.redirect(routes.dashboardCard.skills);
                else
                    res.render(views.genericError, {
                        error: "Database Error",
                        message: "Could not update your ",
                    });
            });
        } else {
            res.render(views.genericError, {
                error: "Session Error",
                message: "Could not find an account associated with the session.",
            });
        }
    });
});

export default router;
