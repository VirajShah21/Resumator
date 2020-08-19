import { Router } from "express";
import { json as bodyParserJson } from "body-parser";
import AccountRouter from "./AccountRouter";
import WorkExperienceRouter from "./WorkExperienceRouter";
import EducationRouter from "./EducationRouter";
import SkillsRouter from "./SkillsRouter";
import CertificationRouter from "./CertificationRouter";
import ThemesRouter from "./ThemesRouter";
import { views } from "@shared/constants";
import SessionErrorPuggable from "@entities/SessionErrorPuggable";
import ResumeInfoPuggable from "@entities/ResumeInfoPuggable";
import { addToObject } from "@shared/functions";
import AccountSessionPuggable from "@entities/AccountSessionPuggable";
import { goalsList } from "@shared/util/GoalParser";
import ResumeAnalyzerPuggable from "@entities/ResumeAnalyzerPuggable";
import fs from "fs";
import path from "path";

export const PREFIX = "/app";
export const ROOT_DIR = path.join(__dirname, "..");
const AppRouter = Router();

const jsonParser = bodyParserJson();

AppRouter.use("/account", AccountRouter);
AppRouter.use("/work-experience", WorkExperienceRouter);
AppRouter.use("/education", EducationRouter);
AppRouter.use("/skills", SkillsRouter);
AppRouter.use("/certifications", CertificationRouter);
AppRouter.use("/themes", ThemesRouter);

AppRouter.get("/dashboard", (req, res) => {
    AccountSessionPuggable.fetch(req.cookies.session, (sessionAccount) => {
        if (sessionAccount) {
            ResumeInfoPuggable.fetch(sessionAccount.account.email, (resumeInfo) => {
                res.render(
                    views.dashboard,
                    addToObject(
                        {
                            session: sessionAccount.session,
                            account: sessionAccount.account,
                            nav: "Dashboard",
                            goalsList,
                            analysis: new ResumeAnalyzerPuggable(sessionAccount.account, resumeInfo),
                        },
                        resumeInfo
                    )
                );
            });
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

AppRouter.get("/help", (req, res) => {
    if (req.query.page) {
        // Route to specific help page
        fs.readFile(path.join(ROOT_DIR, `views/help-pages/${req.query.page}.md`), (err, data) => {
            if (err) {
                res.render(views.genericError, {
                    error: "Could not find help page",
                    message:
                        "This is our fault. We must have put up a faulty link. Please reach out to us so we can correct this.",
                });
            } else {
                res.render("help", { helpPage: data.toString() });
            }
        });
    } else {
        // Route to main help page
        res.render("help");
    }
});

AppRouter.get("/resume-strength", (req, res) => {
    // TODO: Finish this route
    AccountSessionPuggable.fetch(req.cookies.session, (sessionAccount) => {
        if (sessionAccount) {
            ResumeInfoPuggable.fetch(sessionAccount.account.email, (resumeInfo) => {});
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

export default AppRouter;
