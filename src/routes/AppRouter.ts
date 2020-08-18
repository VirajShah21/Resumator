import { Router } from "express";
import BodyParser from "body-parser";
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
import logger from "@shared/Logger";
import { goalsList } from "@shared/util/GoalParser";
import ResumeAnalyzerPuggable from "@entities/ResumeAnalyzerPuggable";

export const PREFIX = "/app";
const AppRouter = Router();

const jsonParser = BodyParser.json();

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
