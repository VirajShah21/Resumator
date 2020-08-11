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
            const certification = new Certification(
                req.body.institution,
                req.body.certification,
                req.body.details,
                req.body["exam-date"],
                session.user
            );
            certification.insertDatabaseItem((success) => {
                if (success) res.redirect("/app/dashboard#certifications-card");
                else res.render(views.unknownError);
            });
        } else {
            res.render(views.unknownError);
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
                if (success) res.redirect("/app/dashboard#certifications-card");
                else res.render(views.unknownError);
            });
        } else {
            res.render(views.unknownError);
        }
    });
});

export default router;
