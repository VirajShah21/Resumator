import { Router } from "express";
import BodyParser from "body-parser";
import Session from "@entities/Session";
import Certification from "@entities/Certification";
import { views, routes } from "@shared/constants";
import SessionErrorPuggable from "@entities/SessionErrorPuggable";
import DatabaseErrorPuggable from "@entities/DatabaseErrorPuggable";

const CertificationRouter = Router();
const jsonParser = BodyParser.json();

CertificationRouter.post("/add", jsonParser, (req, res) => {
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
                else res.render(views.genericError, new DatabaseErrorPuggable("Could not add your certification."));
            });
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

CertificationRouter.post("/update", jsonParser, (req, res) => {
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
                else res.render(views.genericError, new DatabaseErrorPuggable("Could not update the certificate."));
            });
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

export default CertificationRouter;
