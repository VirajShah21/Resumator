import { Router } from "express";
import { json as bodyParserJson } from "body-parser";
import Education from "@entities/Education";
import { ObjectId } from "mongodb";
import { views, routes } from "@shared/constants";
import SessionErrorTransformer from "@transformers/SessionErrorTransformer";
import DatabaseErrorTransformer from "@transformers/DatabaseErrorTransformer";
import AccountSessionTransformer from "@transformers/AccountSessionTransformer";
import { RouterLogger } from "@shared/util/LogUtils";

const EducationRouter = Router();
const jsonParser = bodyParserJson();

EducationRouter.post("/add", (req, res) => {
    const routeLog: RouterLogger = new RouterLogger("/app/education/add", req);
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
        routeLog.logAccountAndSessionFetchResult(accountSession);
        if (accountSession) {
            const education = new Education({
                _id: new ObjectId(),
                user: accountSession.account.email,
                institution: req.body.institution,
                level: req.body.level,
                degree: req.body.degree,
                start: req.body["start-date"],
                end: req.body["end-date"],
                gpa: req.body.gpa,
                description: req.body.description,
            });
            education.insertDatabaseItem((success) => {
                if (success) res.redirect(routes.dashboardCard.education);
                else
                    res.render(
                        views.genericError,
                        new DatabaseErrorTransformer(
                            "Could not add the education to your dashboard."
                        )
                    );
            });
        }
    });
});

EducationRouter.post("/update", (req, res) => {
    const routeLog: RouterLogger = new RouterLogger(
        "/app/education/update",
        req
    );
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
        routeLog.logAccountAndSessionFetchResult(accountSession);
        if (accountSession) {
            const education = new Education({
                _id: req.body._id,
                user: accountSession.account.email,
                institution: req.body.institution,
                level: req.body.level,
                degree: req.body.degree,
                start: req.body["start-date"],
                end: req.body["end-date"],
                gpa: req.body.gpa,
                description: req.body.description,
            });

            if (req.body.delete === "on") {
                education.deleteDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.education);
                    else
                        res.render(
                            views.genericError,
                            new DatabaseErrorTransformer(
                                "Could not not delete this education."
                            )
                        );
                });
            } else {
                education._id = new ObjectId(req.body._id);
                education.updateDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboardCard.education);
                    else
                        res.render(
                            views.genericError,
                            new DatabaseErrorTransformer(
                                "Could not update education."
                            )
                        );
                });
            }
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

export default EducationRouter;
