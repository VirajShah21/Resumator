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

const router = Router();

router.get("/", (req, res) => {
    res.render("themes", {
        nav: "Themes",
    });
});

router.get("/preview", (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            Account.loadFromDatabase(session.user, (account) => {
                if (account) {
                    WorkExperience.loadFromDatabase(account.email, (workExperience) => {
                        Education.loadFromDatabase(account.email, (educationHistory) => {
                            Skill.loadFromDatabase(account.email, (skillset) => {
                                res.render(`resume-templates/${req.query.theme}`, {
                                    account,
                                    workExperience,
                                    educationHistory,
                                    skillset,
                                });
                            });
                        });
                    });
                }
            });
        } else {
            res.render("UnknownError");
        }
    });
});

export default router;
