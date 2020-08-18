import { Router } from "express";
import BodyParser from "body-parser";
import { ObjectId } from "mongodb";
import Skill from "@entities/Skill";
import { views, routes } from "@shared/constants";
import SessionErrorPuggable from "@entities/SessionErrorPuggable";
import DatabaseErrorPuggable from "@entities/DatabaseErrorPuggable";
import AccountSessionPuggable from "@entities/AccountSessionPuggable";

const SkillsRouter = Router();
const jsonParser = BodyParser.json();

SkillsRouter.post("/add", jsonParser, (req, res) => {
    AccountSessionPuggable.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            const skill = new Skill(req.body.skill, req.body.proficiency, accountSession.account.email);
            if (req.body.delete === "on") {
                skill.deleteDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.skills);
                    else res.render(views.genericError, new DatabaseErrorPuggable("Could not delete skill."));
                });
            } else {
                skill.insertDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.skills);
                    else res.render(views.genericError, new DatabaseErrorPuggable("Could not update skill."));
                });
            }
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

SkillsRouter.post("/update", jsonParser, (req, res) => {
    AccountSessionPuggable.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            const skill = new Skill(req.body.skill, req.body.proficiency, accountSession.account.email);
            skill._id = new ObjectId(req.body._id);

            if (req.body.delete === "on") {
                skill.deleteDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.skills);
                    else res.render(views.genericError, new DatabaseErrorPuggable("Could not update skill."));
                });
            } else {
                skill.updateDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.skills);
                    else res.render(views.genericError, new DatabaseErrorPuggable("Could not update skill."));
                });
            }
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

export default SkillsRouter;
