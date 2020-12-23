import { Router } from "express";
import { json as bodyParserJson } from "body-parser";
import WorkExperience from "@entities/WorkExperience";
import { ObjectId } from "mongodb";
import { views, routes } from "@shared/constants";
import DatabaseErrorTransformer from "@transformers/DatabaseErrorTransformer";
import SessionErrorTransformer from "@transformers/SessionErrorTransformer";
import AccountSessionTransformer from "@transformers/AccountSessionTransformer";

const WorkExperienceRouter = Router();
const jsonParser = bodyParserJson();

WorkExperienceRouter.post("/add", jsonParser, (req, res) => {
    const experience = new WorkExperience(
        req.body.position,
        req.body.organization,
        req.body["start-date"],
        req.body["end-date"],
        req.body.description,
        req.body.client.account.email
    );
    experience.insertDatabaseItem((success) => {
        if (success) res.redirect(routes.dashboardCard.workExperience);
        else
            res.render(
                views.genericError,
                new DatabaseErrorTransformer("Could not add work experience.")
            );
    });
});

WorkExperienceRouter.post("/update", (req, res) => {
    const experience = new WorkExperience(
        req.body.position,
        req.body.organization,
        req.body["start-date"],
        req.body["end-date"],
        req.body.description,
        req.body.client.account.email
    );
    experience._id = new ObjectId(req.body.dbid);
    if (req.body.delete === "on") {
        experience.deleteDatabaseItem((success) => {
            if (success) res.redirect(routes.dashboardCard.workExperience);
            else
                res.render(
                    views.genericError,
                    new DatabaseErrorTransformer(
                        "Could not delete work experience."
                    )
                );
        });
    } else {
        experience.updateDatabaseItem((success) => {
            if (success) res.redirect(routes.dashboardCard.workExperience);
            else
                res.render(
                    views.genericError,
                    new DatabaseErrorTransformer(
                        "Could not update work experience."
                    )
                );
        });
    }
});

export default WorkExperienceRouter;
