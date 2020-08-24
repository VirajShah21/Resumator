import { Router } from "express";
import { json as bodyParserJson } from "body-parser";
import Certification from "@entities/Certification";
import { views, routes } from "@shared/constants";
import SessionErrorPuggable from "@entities/SessionErrorPuggable";
import DatabaseErrorPuggable from "@entities/DatabaseErrorPuggable";
import AccountSessionPuggable from "@entities/AccountSessionPuggable";
import { ObjectId } from "mongodb";

const CertificationRouter = Router();
const jsonParser = bodyParserJson();

CertificationRouter.post("/add", jsonParser, (req, res) => {
    AccountSessionPuggable.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            const certification = new Certification({
                _id: new ObjectId(),
                institution: req.body.institution,
                certification: req.body.certification,
                details: req.body.details,
                examDate: req.body["exam-date"],
                user: accountSession.account.email,
            });

            certification.insertDatabaseItem((success) => {
                if (success) res.redirect(routes.dashboardCard.certification);
                else res.render(views.genericError, new DatabaseErrorPuggable("Could not add your certification."));
            });
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

CertificationRouter.post("/update", jsonParser, (req, res) => {
    AccountSessionPuggable.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            const certification = new Certification({
                _id: req.body._id,
                institution: req.body.institution,
                certification: req.body.certification,
                details: req.body.details,
                examDate: req.body["exam-date"],
                user: accountSession.account.email,
            });

            if (req.body.delete === "on") {
                certification.deleteDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.certification);
                    else res.render(views.genericError, new DatabaseErrorPuggable("Could not update the certificate."));
                });
            } else {
                certification.updateDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.certification);
                    else res.render(views.genericError, new DatabaseErrorPuggable("Could not update the certificate."));
                });
            }
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

export default CertificationRouter;
