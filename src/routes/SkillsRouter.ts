import { Router } from "express";
import { json as bodyParserJson } from "body-parser";
import { ObjectId } from "mongodb";
import Skill from "@entities/Skill";
import { views, routes } from "@shared/constants";
import SessionErrorTransformer from "@transformers/SessionErrorTransformer";
import DatabaseErrorTransformer from "@transformers/DatabaseErrorTransformer";
import AccountSessionTransformer from "@transformers/AccountSessionTransformer";

const DB_ERR = "Could not delete skill.";
const SkillsRouter = Router();
const jsonParser = bodyParserJson();

SkillsRouter.post("/add", jsonParser, (req, res) => {
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            const skill = new Skill(req.body.skill, req.body.proficiency, accountSession.account.email);
            if (req.body.delete === "on") {
                skill.deleteDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.skills);
                    else res.render(views.genericError, new DatabaseErrorTransformer(DB_ERR));
                });
            } else {
                skill.insertDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.skills);
                    else res.render(views.genericError, new DatabaseErrorTransformer(DB_ERR));
                });
            }
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

SkillsRouter.post("/update", jsonParser, (req, res) => {
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            const skill = new Skill(req.body.skill, req.body.proficiency, accountSession.account.email);
            skill._id = new ObjectId(req.body._id);

            if (req.body.delete === "on") {
                skill.deleteDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.skills);
                    else res.render(views.genericError, new DatabaseErrorTransformer(DB_ERR));
                });
            } else {
                skill.updateDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.skills);
                    else res.render(views.genericError, new DatabaseErrorTransformer(DB_ERR));
                });
            }
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

export default SkillsRouter;
