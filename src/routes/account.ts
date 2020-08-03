import { Router } from "express";
import BodyParser from "body-parser";
import Session from "@entities/Session";
import Account from "@entities/Account";
import { hashPassword } from "@shared/functions";
import Address from "@entities/Address";

const router = Router();

const jsonParser = BodyParser.json();

router.get("/", (req, res) => {
    res.render("account.pug", {
        nav: "Home",
    });
});

router.post("/signup", jsonParser, (req, res) => {
    if (req.body.password === req.body.passwordconf) {
        hashPassword(req.body.password, (hash) => {
            const account = new Account(req.body.fname, req.body.lname, req.body.email, hash);
            account.insertDatabaseItem((success) => {
                if (success) {
                    const session: Session = new Session(account);
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

router.post("/update", jsonParser, (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        Account.loadFromDatabase(session.user, (account) => {
            account.fname = req.body.fname || account.fname;
            account.lname = req.body.lname || account.lname;
            account.email = req.body.email || account.email;
            account.address = req.body.line1
                ? new Address(req.body.line1, req.body.line2, req.body.city, req.body.state, req.body.zip)
                : account.address;
            account.updateDatabaseItem((success) => {
                res.redirect("/app/dashboard");
            });
        });
    });
});

export default router;
