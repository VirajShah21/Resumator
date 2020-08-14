import { Router } from "express";
import BodyParser from "body-parser";
import Session from "@entities/Session";
import Certification from "@entities/Certification";
import { views, routes } from "@shared/constants";
import SessionErrorPuggable from "@entities/SessionErrorPuggable";
import DatabaseErrorPuggable from "@entities/DatabaseErrorPuggable";
import AccountSessionPuggable from "@entities/AccountSessionPuggable";
import logger from "@shared/Logger";
import { ObjectId } from "mongodb";

const CertificationRouter = Router();
const jsonParser = BodyParser.json();

CertificationRouter.post("/add", jsonParser, (req, res) => {
    AccountSessionPuggable.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            const certification = new Certification(
                req.body.institution,
                req.body.certification,
                req.body.details,
                req.body["exam-date"],
                accountSession.account.email
            );
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
            const certification = new Certification(
                req.body.institution,
                req.body.certification,
                req.body.details,
                req.body["exam-date"],
                accountSession.account.email
            );
            certification._id = new ObjectId(req.body._id);

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
