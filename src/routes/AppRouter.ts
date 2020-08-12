import { Router } from "express";
import BodyParser from "body-parser";
import Account from "@entities/Account";
import Session from "@entities/Session";
import WorkExperience from "@entities/WorkExperience";
import Education from "@entities/Education";
import AccountRouter from "./AccountRouter";
import Skill from "@entities/Skill";
import Certification from "@entities/Certification";
import WorkExperienceRouter from "./WorkExperienceRouter";
import EducationRouter from "./EducationRouter";
import SkillsRouter from "./SkillsRouter";
import CertificationRouter from "./CertificationRouter";
import ThemesRouter from "./ThemesRouter";
import { views } from "@shared/constants";
import SessionErrorPuggable from "@entities/SessionErrorPuggable";

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
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            Account.loadFromDatabase(session.user, (account) => {
                if (account) {
                    WorkExperience.loadFromDatabase(account.email, (workExperience) => {
                        Education.loadFromDatabase(account.email, (educationHistory) => {
                            Skill.loadFromDatabase(account.email, (skillset) => {
                                Certification.loadFromDatabase(account.email, (certifications) => {
                                    res.render(views.dashboard, {
                                        session,
                                        account,
                                        educationHistory,
                                        workExperience,
                                        volunteerExperience: [],
                                        skillset,
                                        certifications,
                                        nav: "Dashboard",
                                    });
                                });
                            });
                        });
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

export default AppRouter;
