import { Router } from "express";
import Account from "@entities/Account";
import Session from "@entities/Session";
import WorkExperience from "@entities/WorkExperience";
import Education from "@entities/Education";
import Skill from "@entities/Skill";
import Certification from "@entities/Certification";
import { views } from "@shared/constants";
import SessionErrorPuggable from "@entities/SessionErrorPuggable";

const ThemesRouter = Router();

ThemesRouter.get("/", (req, res) => {
    res.render("themes", {
        nav: "Themes",
    });
});

ThemesRouter.get("/preview", (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            Account.loadFromDatabase(session.user, (account) => {
                if (account) {
                    WorkExperience.loadFromDatabase(account.email, (workExperience) => {
                        Education.loadFromDatabase(account.email, (educationHistory) => {
                            Skill.loadFromDatabase(account.email, (skillset) => {
                                Certification.loadFromDatabase(account.email, (certifications) => {
                                    res.render(`resume-templates/${req.query.theme}`, {
                                        account,
                                        workExperience,
                                        educationHistory,
                                        skillset,
                                        certifications,
                                    });
                                });
                            });
                        });
                    });
                }
            });
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

export default ThemesRouter;
