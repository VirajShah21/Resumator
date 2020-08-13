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
    AccountSessionPuggable.fetch(req.cookies.session, (session) => {
        if (session) {
            ResumeInfoPuggable.fetch(session.account.email, (resumeInfo) => {
                res.render(
                    views.dashboard,
                    addToObject(
                        {
                            session: session.session,
                            account: session.account,
                            nav: "Dashboard",
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

export default AppRouter;
