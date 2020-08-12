import { Router } from "express";
import BodyParser from "body-parser";
import Account from "@entities/Account";
import Session from "@entities/Session";
import WorkExperience from "@entities/WorkExperience";
import { ObjectId } from "mongodb";
import { views, routes } from "@shared/constants";
import DatabaseErrorPuggable from "@entities/DatabaseErrorPuggable";
import SessionErrorPuggable from "@entities/SessionErrorPuggable";

const WorkExperienceRouter = Router();
const jsonParser = BodyParser.json();

WorkExperienceRouter.post("/add", jsonParser, (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            Account.loadFromDatabase(session.user, (account) => {
                if (account) {
                    const experience = new WorkExperience(
                        req.body.position,
                        req.body.organization,
                        req.body["start-date"],
                        req.body["end-date"],
                        req.body.description,
                        account.email
                    );
                    experience.insertDatabaseItem((success) => {
                        if (success) res.redirect(routes.dashboardCard.workExperience);
                        else
                            res.render(views.genericError, new DatabaseErrorPuggable("Could not add work experience."));
                    });
                } else {
                    res.render(views.genericError, new SessionErrorPuggable());
                }
            });
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

WorkExperienceRouter.post("/update", (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            const experience = new WorkExperience(
                req.body.position,
                req.body.organization,
                req.body.start,
                req.body.end,
                req.body.description,
                session.user
            );
            experience._id = new ObjectId(req.body.dbid);

            if (req.body.delete === "on") {
                experience.deleteDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.workExperience);
                    else res.render(views.genericError, new DatabaseErrorPuggable("Could not delete work experience."));
                });
            } else {
                experience.updateDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.workExperience);
                    else res.render(views.genericError, new DatabaseErrorPuggable("Could not update work experience."));
                });
            }
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

export default WorkExperienceRouter;