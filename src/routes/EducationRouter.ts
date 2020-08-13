import { Router } from "express";
import BodyParser from "body-parser";
import Account from "@entities/Account";
import Session from "@entities/Session";
import Education from "@entities/Education";
import { ObjectId } from "mongodb";
import { views, routes } from "@shared/constants";
import SessionErrorPuggable from "@entities/SessionErrorPuggable";
import DatabaseErrorPuggable from "@entities/DatabaseErrorPuggable";
import logger from "@shared/Logger";
import { AccountSessionAccess } from "@entities/AccountSessionPuggable";

const EducationRouter = Router();
const jsonParser = BodyParser.json();

EducationRouter.post("/add", (req, res) => {
    AccountSessionAccess.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            const education = new Education(
                accountSession.account.email,
                req.body.institution,
                req.body.level,
                req.body.degree,
                req.body["start-date"],
                req.body["end-date"],
                req.body.gpa,
                req.body.description
            );
            education.insertDatabaseItem((success) => {
                if (success) res.redirect(routes.dashboardCard.education);
                else
                    res.render(
                        views.genericError,
                        new DatabaseErrorPuggable("Could not add the education to your dashboard.")
                    );
            });
        }
    });
});

EducationRouter.post("/update", (req, res) => {
    AccountSessionAccess.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            const education = new Education(
                accountSession.account.email,
                req.body.institution,
                req.body.level,
                req.body.degree,
                req.body.start,
                req.body.end,
                req.body.gpa,
                req.body.description
            );

            if (req.body.delete === "on") {
                education.deleteDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.education);
                    else
                        res.render(
                            views.genericError,
                            new DatabaseErrorPuggable("Could not not delete this education.")
                        );
                });
            } else {
                education._id = new ObjectId(req.body._id);
                education.updateDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.education);
                    else res.render(views.genericError, new DatabaseErrorPuggable("Could not update education."));
                });
            }
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

export default EducationRouter;
