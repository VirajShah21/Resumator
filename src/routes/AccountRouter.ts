import { Router } from "express";
import { json as bodyParserJson } from "body-parser";
import Session from "@entities/Session";
import Account from "@entities/Account";
import { hashPassword, comparePasswordWithHash } from "@shared/functions";
import Address from "@entities/Address";
import { views, routes } from "@shared/constants";
import SessionErrorTransformer from "@transformers/SessionErrorTransformer";
import DatabaseErrorTransformer from "@transformers/DatabaseErrorTransformer";
import AccountSessionTransformer from "@transformers/AccountSessionTransformer";
import { ObjectId } from "mongodb";
import Logger from "@shared/Logger";
import multer from "multer";
import path from "path";
import { exec } from "child_process";
import fs from "fs";
import { uploadProfilePhoto } from "@shared/cloud";

const AccountRouter = Router();

AccountRouter.use(bodyParserJson());

const profilePhotoUploads: any = {};

// Setup temp storage directory
exec("mkdir /tmp", () => {
    if (!fs.existsSync("/tmp")) {
        Logger.error("Could not create /tmp");
    } else {
        Logger.info("Created /tmp");
        exec("mkdir /tmp/profile_photos", () => {
            if (!fs.existsSync("/tmp/profile_photos")) {
                Logger.error("Could not create /tmp/profile_photos");
            } else {
                Logger.info("Created /tmp/profile_photos");
            }
        });
    }
});

AccountRouter.get("/", (req, res) => {
    if (req.cookies.session) {
        AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
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

AccountRouter.post("/signup", (req, res) => {
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
                                new DatabaseErrorTransformer(
                                    "Could not create a new session. Your account was created, however, you will need to login manually."
                                )
                            );
                        }
                    });
                } else {
                    res.render(views.genericError, new DatabaseErrorTransformer("Could not create a new account."));
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

AccountRouter.post("/update", (req, res) => {
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            accountSession.account.fname = req.body.fname || accountSession.account.fname;
            accountSession.account.lname = req.body.lname || accountSession.account.lname;
            accountSession.account.email = req.body.email || accountSession.account.email;

            if (req.body.line1) {
                accountSession.account.address = new Address({
                    line1: req.body.line1,
                    line2: req.body.line2,
                    city: req.body.city,
                    state: req.body.state,
                    zip: req.body.zip,
                });
            }

            accountSession.account.phone = req.body.phone;

            accountSession.account.updateDatabaseItem((success) => {
                if (success) res.redirect(routes.dashboard);
                else res.render(views.genericError, new DatabaseErrorTransformer("Could not update account info"));
            });
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

AccountRouter.post("/update-goal", (req, res) => {
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            accountSession.account.currentGoal = req.body.goal;
            accountSession.account.objective = req.body.objective;
            accountSession.account.updateDatabaseItem((success) => {
                if (success) {
                    res.redirect(routes.dashboardCard.goals);
                } else {
                    res.render(views.genericError, new DatabaseErrorTransformer("Could not update goal "));
                }
            });
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

AccountRouter.post("/login", (req, res) => {
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
                                new DatabaseErrorTransformer("Could not create a new session.")
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
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

AccountRouter.get("/logout", (req, res) => {
    res.cookie("session", { expires: Date.now() });
    res.redirect("/app/account");
});

AccountRouter.post(
    "/profile-pic/change",
    multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, "/tmp/profile_photos");
            },
            filename: (req, file, cb) => {
                const filename = `${Date.now()}-${file.filename}`;
                profilePhotoUploads[req.cookies.session] = filename;
                cb(null, filename);
            },
        }),
    }).single("file"),
    (req, res) => {
        const destination = "/tmp/profile_photos";
        const filename = profilePhotoUploads[req.cookies.session];
        const fullpath = path.join(destination, filename);  

        AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
            if (accountSession) {
                uploadProfilePhoto(fullpath, accountSession.account._id);
                accountSession.account.photo = true;
                accountSession.account.updateDatabaseItem((success) => {
                    if (success)
                        res.send("Great! Your profile photo has been updated!");
                    else
                        res.send("There seems to be an issue with your account.");
                });       
            } else {
                res.send("There seems to be an issue with your account.");
            }
        });
    }
);

AccountRouter.get("/my-photo", (req, res) => {
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
        if (accountSession) {
            if (accountSession.account.photo)
                res.redirect(
                    `https://res.cloudinary.com/virajshah/image/upload/v1600066438/profile_photos/${accountSession?.account._id}.jpg`
                );
            else res.redirect("https://placehold.it/300x300");
        } else {
            res.redirect("https://placehold.it/300x300");
        }
    });
});

export default AccountRouter;
