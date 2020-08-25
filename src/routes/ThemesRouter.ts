import { Router } from "express";
import { views } from "@shared/constants";
import SessionErrorPuggable from "@entities/SessionErrorTransformer";
import ResumeInfoPuggable from "@entities/ResumeInfoTransformer";
import AccountSessionPuggable from "@entities/AccountSessionTransformer";

const ThemesRouter = Router();

ThemesRouter.get("/", (req, res) => {
    AccountSessionPuggable.fetch(req.cookies.session, (accountSession) => {
        if (accountSession && accountSession.account) {
            res.render("themes", {
                nav: "Themes",
                account: accountSession.account,
            });
        } else {
            res.render("themes", {
                nav: "Themes",
            });
        }
    });
});

ThemesRouter.get("/preview", (req, res) => {
    AccountSessionPuggable.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            ResumeInfoPuggable.fetch(accountSession.account.email, (resumeInfo) => {
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
