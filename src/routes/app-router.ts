import { Router } from "express";
import BodyParser from "body-parser";
import Account from "@entities/Account";
import { hashPassword } from "@shared/functions";
import Session from "@entities/Session";
import WorkExperience from "@entities/WorkExperience";

export const PREFIX = "/account";
const router = Router();

const jsonParser = BodyParser.json();

router.get("/account", (req, res) => {
    res.render("account.pug", {
        nav: "Home",
    });
});

router.post("/account/signup", jsonParser, (req, res) => {
    if (req.body.password == req.body.passwordconf) {
        hashPassword(req.body.password, (hash) => {
            let account = new Account(
                req.body.fname,
                req.body.lname,
                req.body.email,
                hash
            );
            account.insertDatabaseItem((success) => {
                if (success) {
                    let session: Session = new Session(account);
                    session.insertDatabaseItem(() => {
                        res.cookie("session", session.key);
                        res.redirect("/app/dashboard");
                    });
                } else {
                    res.render("/app/signup-error", {
                        nav: "Home",
                    });
                }
            });
        });
    }
});

router.get("/dashboard", (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        Account.loadFromDatabase(session.user, (account) => {
            WorkExperience.loadFromDatabase(
                account.email,
                (workExperience: WorkExperience[]) => {
                    console.log(workExperience);
                    res.render("dashboard", {
                        session,
                        account,
                        education: [],
                        workExperience,
                        volunteerExperience: [],
                        nav: "Dashboard",
                    });
                }
            );
        });
    });
});

router.post("/work-experience/add", jsonParser, (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        Account.loadFromDatabase(session.user, (account) => {
            let experience = new WorkExperience(
                req.body.position,
                req.body.organization,
                req.body["start-date"],
                req.body["end-date"],
                req.body.description,
                account.email
            );
            experience.insertDatabaseItem(() => {
                res.redirect("/app/dashboard");
            });
        });
    });
});

// router.get("/education/add", (req, res) => {
//     Session.loadFromDatabase(req.cookies.session, (session) => {
//         Account.loadFromDatabase(session.user, (accout) => {
//             let education = new Education();
//         });
//     });
// });

export default router;
