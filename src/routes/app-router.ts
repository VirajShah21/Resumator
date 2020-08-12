import { Router } from "express";
import BodyParser from "body-parser";
import Account from "@entities/Account";
import Session from "@entities/Session";
import WorkExperience from "@entities/WorkExperience";
import Education from "@entities/Education";
import { ObjectId } from "mongodb";
import AccountRouter from "./account";
import Skill from "@entities/Skill";
import Certification from "@entities/Certification";
import WorkExperienceRouter from "./work-experience";
import EducationRouter from "./education";
import SkillsRouter from "./skills";
import CertificationRouter from "./certifications";
import ThemesRouter from "./themes";
import { views } from "@shared/constants";
import SessionErrorPuggable from "@entities/SessionErrorPuggable";

export const PREFIX = "/app";
const router = Router();

const jsonParser = BodyParser.json();

router.use("/account", AccountRouter);
router.use("/work-experience", WorkExperienceRouter);
router.use("/education", EducationRouter);
router.use("/skills", SkillsRouter);
router.use("/certifications", CertificationRouter);
router.use("/themes", ThemesRouter);

router.get("/dashboard", (req, res) => {
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

export default router;
