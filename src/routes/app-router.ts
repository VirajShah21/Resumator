import { Router } from "express";
import BodyParser from "body-parser";
import Account from "@entities/Account";
import Session from "@entities/Session";
import WorkExperience from "@entities/WorkExperience";
import Education from "@entities/Education";
import path from "path";
import { ObjectId } from "mongodb";
import AccountRouter from "./account";
import Skill from "@entities/Skill";

export const PREFIX = "/app";
const router = Router();

const jsonParser = BodyParser.json();

router.use("/account", AccountRouter);

router.get("/dashboard", (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            Account.loadFromDatabase(session.user, (account) => {
                if (account) {
                    WorkExperience.loadFromDatabase(account.email, (workExperience) => {
                        Education.loadFromDatabase(account.email, (educationHistory) => {
                            Skill.loadFromDatabase(account.email, (skillset) => {
                                res.render("dashboard", {
                                    session,
                                    account,
                                    educationHistory,
                                    workExperience,
                                    volunteerExperience: [],
                                    skillset,
                                    nav: "Dashboard",
                                });
                            });
                        });
                    });
                }
            });
        } else {
            // TODO: Throw an error
        }
    });
});

router.post("/work-experience/add", jsonParser, (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            Account.loadFromDatabase(session.user, (account) => {
                if (account) {
                    const experience = new WorkExperience(
                        req.body.position,
                        req.body.organization,
                        req.body["start-date"],
                        req.body["end-date"],
                        req.body.description,
                        account.email
                    );
                    experience.insertDatabaseItem(() => {
                        res.redirect("back");
                        // res.redirect(path.join(PREFIX, "dashboard"));
                    });
                }
            });
        } else {
            // TODO: Throw an error
        }
    });
});

router.post("/education/add", (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            Account.loadFromDatabase(session.user, (account) => {
                if (account) {
                    const education = new Education(
                        account.email,
                        req.body.institution,
                        req.body.level,
                        req.body.degree,
                        req.body["start-date"],
                        req.body["end-date"],
                        req.body.gpa,
                        req.body.description
                    );
                    education.insertDatabaseItem(() => {
                        res.redirect("back");
                        // res.redirect(path.join(PREFIX, "dashboard"));
                    });
                }
            });
        } else {
            // Throw an error
        }
    });
});

router.get("/themes", (req, res) => {
    res.render("themes", {
        nav: "Themes",
    });
});

router.get("/themes/preview", (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            Account.loadFromDatabase(session.user, (account) => {
                if (account) {
                    WorkExperience.loadFromDatabase(account.email, (workExperience) => {
                        Education.loadFromDatabase(account.email, (educationHistory) => {
                            res.render(`resume-templates/${req.query.theme}`, {
                                account,
                                workExperience,
                                educationHistory,
                            });
                        });
                    });
                }
            });
        } else {
            // TODO: Throw an error
        }
    });
});

router.post("/work-experience/update", (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            const experience = new WorkExperience(
                req.body.position,
                req.body.organization,
                req.body.start,
                req.body.end,
                req.body.description,
                session.user
            );
            experience._id = new ObjectId(req.body.dbid);
            experience.updateDatabaseItem(() => {
                res.redirect("back");
            });
        } else {
            // TODO: Throw an error
        }
    });
});

router.post("/education/update", (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            const education = new Education(
                session.user,
                req.body.institution,
                req.body.level,
                req.body.degree,
                req.body.start,
                req.body.end,
                req.body.gpa,
                req.body.description
            );
            education._id = new ObjectId(req.body._id);
            education.updateDatabaseItem(() => {
                res.redirect("back");
            });
        } else {
            // Throw an error
        }
    });
});

router.post("/skills/add", jsonParser, (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            const skill = new Skill(req.body.skill, req.body.proficiency, session.user);
            skill.insertDatabaseItem((success) => {
                res.redirect("back");
            });
        } else {
            // TODO: Throw an error
        }
    });
});

router.post("/skills/update", jsonParser, (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            const skill = new Skill(req.body.skill, req.body.proficiency, session.user);
            skill._id = new ObjectId(req.body._id);
            skill.updateDatabaseItem((success) => {
                if (success) res.redirect("back");
                else res.send("failed");
            });
        } else {
            // TODO: Throw an error
        }
    });
});

export default router;
