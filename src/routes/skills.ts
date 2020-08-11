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
import { views } from "@shared/constants";

const router = Router();
const jsonParser = BodyParser.json();

router.post("/add", jsonParser, (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            const skill = new Skill(req.body.skill, req.body.proficiency, session.user);

            if (req.body.delete === "on") {
                skill.deleteDatabaseItem((success) => {
                    res.redirect("/app/dashboard#skillset-card");
                });
            } else {
                skill.insertDatabaseItem((success) => {
                    res.redirect("/app/dashboard#skillset-card");
                });
            }
        } else {
            res.render(views.unknownError);
        }
    });
});

router.post("/update", jsonParser, (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            const skill = new Skill(req.body.skill, req.body.proficiency, session.user);
            skill._id = new ObjectId(req.body._id);
            skill.updateDatabaseItem((success) => {
                if (success) res.redirect("back");
                else res.render(views.unknownError);
            });
        } else {
            res.render(views.unknownError);
        }
    });
});

export default router;
