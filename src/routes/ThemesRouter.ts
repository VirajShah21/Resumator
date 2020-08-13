import { Router } from "express";
import Account from "@entities/Account";
import Session from "@entities/Session";
import WorkExperience from "@entities/WorkExperience";
import Education from "@entities/Education";
import Skill from "@entities/Skill";
import Certification from "@entities/Certification";
import { views } from "@shared/constants";
import SessionErrorPuggable from "@entities/SessionErrorPuggable";
import { ResumeInfoAccess } from "@entities/ResumeInfoPuggable";
import { AccountSessionAccess } from "@entities/AccountSessionPuggable";

const ThemesRouter = Router();

ThemesRouter.get("/", (req, res) => {
    res.render("themes", {
        nav: "Themes",
    });
});

ThemesRouter.get("/preview", (req, res) => {
    AccountSessionAccess.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            ResumeInfoAccess.fetch(accountSession.account.email, (resumeInfo) => {
                if (resumeInfo) {
                    res.render(`resume-templates/${req.query.theme}`, {
                        account: accountSession.account,
                        workExperience: resumeInfo.workExperience,
                        educationHistory: resumeInfo.educationHistory,
                        skillset: resumeInfo.skillset,
                        certifications: resumeInfo.certifications,
                    });
                } else {
                    res.render(views.genericError, new SessionErrorPuggable());
                }
            });
        }
    });
});

export default ThemesRouter;
