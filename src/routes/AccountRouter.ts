import { Router } from "express";
import { json as bodyParserJson } from "body-parser";
import Session from "@entities/Session";
import Account from "@entities/Account";
import { hashPassword, comparePasswordWithHash } from "@shared/functions";
import Address from "@entities/Address";
import { views, routes } from "@shared/constants";
import SessionErrorPuggable from "@entities/SessionErrorPuggable";
import DatabaseErrorPuggable from "@entities/DatabaseErrorPuggable";
import AccountSessionPuggable from "@entities/AccountSessionPuggable";
import { ObjectId } from "mongodb";

const AccountRouter = Router();
const jsonParser = bodyParserJson();

AccountRouter.get("/", (req, res) => {
    if (req.cookies.session) {
        AccountSessionPuggable.fetch(req.cookies.session, (accountSession) => {
            if (accountSession && accountSession.account) {
                res.render("manage-account", {
                    nav: "Account",
                    account: accountSession.account,
                });
            } else {
                res.render(views.accountPage, {
                    nav: "Account",
                });
            }
        });
    } else {
        res.render(views.accountPage, {
            nav: "Account",
        });
    }
});

AccountRouter.post("/signup", jsonParser, (req, res) => {
    if (req.body.password === req.body.passwordconf) {
        hashPassword(req.body.password, (hash) => {
            const account = new Account({
                _id: new ObjectId(),
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: hash,
            });
            account.insertDatabaseItem((accountSuccess) => {
                if (accountSuccess) {
                    const session: Session = new Session(account);
                    session.insertDatabaseItem((sessionSuccess) => {
                        if (sessionSuccess) {
                            res.cookie("session", session.key);
                            res.redirect(routes.dashboard);
                        } else {
                            res.render(
                                views.genericError,
                                new DatabaseErrorPuggable(
                                    "Could not create a new session. Your account was created, however, you will need to login manually."
                                )
                            );
                        }
                    });
                } else {
                    res.render(views.genericError, new DatabaseErrorPuggable("Could not create a new account."));
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

AccountRouter.post("/update", jsonParser, (req, res) => {
    AccountSessionPuggable.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            accountSession.account.fname = req.body.fname || accountSession.account.fname;
            accountSession.account.lname = req.body.lname || accountSession.account.lname;
            accountSession.account.email = req.body.email || accountSession.account.email;
            accountSession.account.address = req.body.line1
                ? new Address(req.body.line1, req.body.line2, req.body.city, req.body.state, req.body.zip)
                : accountSession.account.address;
            accountSession.account.phone = req.body.phone;

            accountSession.account.updateDatabaseItem((success) => {
                if (success) res.redirect(routes.dashboard);
                else res.render(views.genericError, new DatabaseErrorPuggable("Could not update account info"));
            });
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

AccountRouter.post("/update-goal", jsonParser, (req, res) => {
    AccountSessionPuggable.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            accountSession.account.currentGoal = req.body.goal;
            accountSession.account.objective = req.body.objective;
            accountSession.account.updateDatabaseItem((success) => {
                if (success) {
                    res.redirect(routes.dashboardCard.goals);
                } else {
                    res.render(views.genericError, new DatabaseErrorPuggable("Could not update goal "));
                }
            });
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

AccountRouter.post("/login", jsonParser, (req, res) => {
    Account.loadFromDatabase(req.body.email, (account) => {
        if (account) {
            comparePasswordWithHash(req.body.password, account.password, (correctPassword) => {
                if (correctPassword) {
                    const session: Session = new Session(account);
                    res.cookie("session", session.key);
                    session.insertDatabaseItem((isSessionAdded) => {
                        if (isSessionAdded) res.redirect(routes.dashboard);
                        else
                            res.render(
                                views.genericError,
                                new DatabaseErrorPuggable("Could not create a new session.")
                            );
                    });
                } else {
                    res.render(views.genericError, {
                        error: "Wrong Password",
                        message: "You entered an incorrect password. Passwords are case sensitive",
                    });
                }
            });
        } else {
            res.render(views.genericError, new SessionErrorPuggable());
        }
    });
});

AccountRouter.get("/logout", (req, res) => {
    res.cookie("session", { expires: Date.now() });
    res.redirect("/app/account");
});

export default AccountRouter;
