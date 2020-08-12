import { Router } from "express";
import BodyParser from "body-parser";
import Session from "@entities/Session";
import Account from "@entities/Account";
import { hashPassword, comparePasswordWithHash } from "@shared/functions";
import Address from "@entities/Address";
import { views, routes } from "@shared/constants";

const router = Router();

const jsonParser = BodyParser.json();

router.get("/", (req, res) => {
    res.render(views.accountPage, {
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
                    session.insertDatabaseItem((success) => {
                        if (success) {
                            res.cookie("session", session.key);
                            res.redirect(routes.dashboard);
                        } else {
                            res.render(views.genericError, {
                                error: "Signup Error",
                                message: "Something wrong happened on our end. Please try again in a couple minutes.",
                            });
                        }
                    });
                } else {
                    res.render(views.genericError, {
                        error: "Oops, our bad",
                        message: "Something went wrong, but we don't know why. Please try signing up again later.",
                    });
                }
            });
        });
    } else {
        res.render(views.genericError, {
            error: "Passwords don't match",
            message:
                "Your password and confirmation password do not match. Please make sure they are typed exactly the same. Passwords are case sensitive",
        });
    }
});

router.post("/update", jsonParser, (req, res) => {
    Session.loadFromDatabase(req.cookies.session, (session) => {
        if (session) {
            Account.loadFromDatabase(session.user, (account) => {
                if (account) {
                    account.fname = req.body.fname || account.fname;
                    account.lname = req.body.lname || account.lname;
                    account.email = req.body.email || account.email;
                    account.address = req.body.line1
                        ? new Address(req.body.line1, req.body.line2, req.body.city, req.body.state, req.body.zip)
                        : account.address;
                    account.updateDatabaseItem((success) => {
                        if (success) res.redirect(routes.dashboard);
                        else
                            res.render(views.genericError, {
                                error: "Account Issue",
                                message: "There was an issue updating your account.",
                            });
                    });
                } else {
                    res.render(views.genericError, {
                        error: "Account Issue",
                        message: "There is an issue loading your account. Please sign out and log back in.",
                    });
                }
            });
        } else {
            res.render(views.genericError, {
                error: "Security!!",
                message: "It seems like something went wrong with your session. Please log back in",
            });
        }
    });
});

router.post("/login", jsonParser, (req, res) => {
    Account.loadFromDatabase(req.body.email, (account) => {
        if (account) {
            comparePasswordWithHash(req.body.password, account.password, (correctPassword) => {
                if (correctPassword) {
                    const session: Session = new Session(account);
                    res.cookie("session", session.key);
                    session.insertDatabaseItem((isSessionAdded) => {
                        if (isSessionAdded) {
                            res.redirect(routes.dashboard);
                        } else {
                            res.render(views.genericError, {
                                error: "Oops, our bad",
                                message:
                                    "We could not log you in, and it is our fault. Please try logging back in later",
                            });
                        }
                    });
                } else {
                    res.render(views.genericError, {
                        error: "Wrong Password",
                        message: "You entered an incorrect password. Passwords are case sensitive",
                    });
                }
            });
        } else {
            res.render(views.genericError, {
                error: "Account Error",
                message: `We could not find an account with the email: ${req.body.email}`,
            });
        }
    });
});

export default router;
