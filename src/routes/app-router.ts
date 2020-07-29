import { Router } from "express";
import BodyParser from "body-parser";
import Account from "@entities/Account";
import { hashPassword } from "@shared/functions";
import Session from "@entities/Session";

export const PREFIX = "/account";
const router = Router();

const jsonParser = BodyParser.json();

router.get("/account", (req, res) => {
    res.render("account.pug");
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
                }
            });
        });
    }
});

router.get("/dashboard", (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        Account.loadFromDatabase(session.user, (account) => {
            res.render("dashboard", {
                session,
                account,
            });
        });
    });
});

router.get("/resumeinfo", (req, res) => {
    res.render("resume-info");
});

export default router;
