import { Router } from "express";
import { views } from "@shared/constants";
import SessionErrorTransformer from "@transformers/SessionErrorTransformer";
import ResumeInfoTransformer from "@transformers/ResumeInfoTransformer";
import AccountSessionTransformer from "@transformers/AccountSessionTransformer";

const ThemesRouter = Router();

ThemesRouter.get("/", (req, res) => {
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
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
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            ResumeInfoTransformer.fetch(
                accountSession.account.email,
                (resumeInfo) => {
                    if (resumeInfo) {
                        res.render(`resume-templates/${req.query.theme}`, {
                            account: accountSession.account,
                            workExperience: resumeInfo.workExperience,
                            educationHistory: resumeInfo.educationHistory,
                            skillset: resumeInfo.skillset,
                            certifications: resumeInfo.certifications,
                        });
                    } else {
                        res.render(
                            views.genericError,
                            new SessionErrorTransformer()
                        );
                    }
                }
            );
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

export default ThemesRouter;
