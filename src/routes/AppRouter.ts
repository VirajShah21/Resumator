import { Router } from "express";
import { json as bodyParserJson } from "body-parser";
import AccountRouter from "./AccountRouter";
import WorkExperienceRouter from "./WorkExperienceRouter";
import EducationRouter from "./EducationRouter";
import SkillsRouter from "./SkillsRouter";
import CertificationRouter from "./CertificationRouter";
import ThemesRouter from "./ThemesRouter";
import { views } from "@shared/constants";
import SessionErrorTransformer from "@transformers/SessionErrorTransformer";
import ResumeInfoTransformer from "@transformers/ResumeInfoTransformer";
import { addToObject } from "@shared/functions";
import AccountSessionTransformer from "@transformers/AccountSessionTransformer";
import { goalsList } from "@shared/util/GoalParser";
import ResumeAnalysisTransformer from "@transformers/ResumeAnalysisTransformer";
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
    AccountSessionTransformer.fetch(req.cookies.session, (sessionAccount) => {
        if (sessionAccount) {
            ResumeInfoTransformer.fetch(sessionAccount.account.email, (resumeInfo) => {
                res.render(
                    views.dashboard,
                    addToObject(
                        {
                            session: sessionAccount.session,
                            account: sessionAccount.account,
                            nav: "Dashboard",
                            goalsList,
                            analysis: new ResumeAnalysisTransformer(sessionAccount.account, resumeInfo),
                        },
                        resumeInfo
                    )
                );
            });
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

AppRouter.get("/help", (req, res) => {
    AccountSessionTransformer.fetch(req.cookies.session, (sessionAccount) => {
        if (sessionAccount) {
            ResumeInfoTransformer.fetch(sessionAccount?.account.email, (resumeInfo) => {
                if (req.query.page) {
                    // Route to specific help page
                    res.render("help", addToObject({ helpPage: req.query.page, nav: "Help" }, resumeInfo));
                } else {
                    // Route to main help page
                    res.render("help", { nav: "Help" });
                }
            });
        } else {
            res.redirect("/");
        }
    });
});

AppRouter.get("/resume-strength", (req, res) => {
    // TODO: Finish this route
    AccountSessionTransformer.fetch(req.cookies.session, (sessionAccount) => {
        if (sessionAccount) {
            ResumeInfoTransformer.fetch(sessionAccount.account.email, (resumeInfo) => {});
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

export default AppRouter;
