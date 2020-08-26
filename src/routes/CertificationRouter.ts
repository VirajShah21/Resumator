import { Router } from "express";
import { json as bodyParserJson } from "body-parser";
import Certification from "@entities/Certification";
import { views, routes } from "@shared/constants";
import SessionErrorTransformer from "@transformers/SessionErrorTransformer";
import DatabaseErrorTransformer from "@transformers/DatabaseErrorTransformer";
import AccountSessionTransformer from "@transformers/AccountSessionTransformer";
import { ObjectId } from "mongodb";

const CertificationRouter = Router();
const jsonParser = bodyParserJson();

CertificationRouter.post("/add", jsonParser, (req, res) => {
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
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
                else res.render(views.genericError, new DatabaseErrorTransformer("Could not add your certification."));
            });
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

CertificationRouter.post("/update", jsonParser, (req, res) => {
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
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
                    else
                        res.render(
                            views.genericError,
                            new DatabaseErrorTransformer("Could not update the certificate.")
                        );
                });
            } else {
                certification.updateDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.certification);
                    else
                        res.render(
                            views.genericError,
                            new DatabaseErrorTransformer("Could not update the certificate.")
                        );
                });
            }
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

export default CertificationRouter;
