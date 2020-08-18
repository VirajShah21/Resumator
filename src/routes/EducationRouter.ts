import { Router } from "express";
import BodyParser from "body-parser";
import Education from "@entities/Education";
import { ObjectId } from "mongodb";
import { views, routes } from "@shared/constants";
import SessionErrorPuggable from "@entities/SessionErrorPuggable";
import DatabaseErrorPuggable from "@entities/DatabaseErrorPuggable";
import AccountSessionPuggable from "@entities/AccountSessionPuggable";

const EducationRouter = Router();
const jsonParser = BodyParser.json();

EducationRouter.post("/add", (req, res) => {
    AccountSessionPuggable.fetch(req.cookies.session, (accountSession) => {
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
    AccountSessionPuggable.fetch(req.cookies.session, (accountSession) => {
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
            education._id = req.body._id;

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
