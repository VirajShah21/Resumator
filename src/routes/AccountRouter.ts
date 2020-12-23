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
import multer from "multer";
import path from "path";
import { exec } from "child_process";
import fs from "fs";
import { uploadProfilePhoto } from "@shared/cloud";
import logger from "@shared/Logger";
import { VerifyEmailer } from "@shared/util/Emailer";
import EmailTransition from "@entities/EmailTransition";
import Certification from "@entities/Certification";
import Education from "@entities/Education";
import Skill from "@entities/Skill";
import WorkExperience from "@entities/WorkExperience";
import { RouterLogger } from "@shared/util/LogUtils";

const AccountRouter = Router();

AccountRouter.use(bodyParserJson());

const profilePhotoUploads: any = {};
const verifyEmailTokens: {
    email: string;
    userId: ObjectId;
    token: string;
}[] = [];

// Setup temp storage directory
exec("mkdir /tmp", () => {
    if (!fs.existsSync("/tmp")) {
        logger.error("Could not create /tmp");
    } else {
        logger.info("Created /tmp");
        exec("mkdir /tmp/profile_photos", () => {
            if (!fs.existsSync("/tmp/profile_photos")) {
                logger.error("Could not create /tmp/profile_photos");
            } else {
                logger.info("Created /tmp/profile_photos");
            }
        });
    }
});

AccountRouter.get("/", (req, res) => {
    const routeLog: RouterLogger = new RouterLogger("/app/account/", req);
    if (req.cookies.session) {
        AccountSessionTransformer.fetch(
            req.cookies.session,
            (accountSession) => {
                routeLog.logAccountAndSessionFetchResult(accountSession);
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
            }
        );
    } else {
        res.render(views.accountPage, {
            nav: "Account",
        });
    }
});

AccountRouter.post("/signup", (req, res) => {
    const routeLog: RouterLogger = new RouterLogger("/app/account/signup", req);
    if (req.body.password === req.body.passwordconf) {
        hashPassword(req.body.password, (hash) => {
            const account = new Account({
                _id: new ObjectId(),
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: hash,
                emailVerified: false,
            });
            account.insertDatabaseItem((accountSuccess) => {
                if (accountSuccess) {
                    const session: Session = new Session(account);
                    session.insertDatabaseItem((sessionSuccess) => {
                        if (sessionSuccess) {
                            // Send an email verification email
                            const emailer = new VerifyEmailer(account._id);
                            let verifyPin =
                                Math.round(Math.random() * 1000000) + "";
                            while (verifyPin.length < 6)
                                verifyPin = "0" + verifyPin;
                            emailer.sendVerifyEmail(verifyPin);
                            verifyEmailTokens.push({
                                email: account.email,
                                userId: new ObjectId(account._id),
                                token: verifyPin,
                            });

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
                    res.render(
                        views.genericError,
                        new DatabaseErrorTransformer(
                            "Could not create a new account."
                        )
                    );
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
    const routeLog: RouterLogger = new RouterLogger("/app/account/update", req);
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
        routeLog.logAccountAndSessionFetchResult(accountSession);
        if (accountSession) {
            const account: Account = accountSession.account;
            account.fname = req.body.fname || account.fname;
            account.lname = req.body.lname || account.lname;

            // If the email address has changed
            if (req.body.email !== account.email) {
                const oldEmail: string = account.email;
                const newEmail: string = req.body.email;

                account.emailVerified = false;
                account.email = newEmail || oldEmail;

                // Create new session cookie and db item for the new account email
                const newSession = new Session(account);
                newSession.insertDatabaseItem((success) => {
                    if (success) res.cookie("session", newSession.key);

                    if (req.body.line1) {
                        account.address = new Address({
                            line1: req.body.line1,
                            line2: req.body.line2,
                            city: req.body.city,
                            state: req.body.state,
                            zip: req.body.zip,
                        });
                    }

                    account.phone = req.body.phone;

                    // Send an email verification email
                    const emailer = new VerifyEmailer(account._id);
                    let verifyPin = Math.round(Math.random() * 1000000) + "";
                    while (verifyPin.length < 6) verifyPin = "0" + verifyPin;
                    emailer.sendVerifyEmail(verifyPin);
                    verifyEmailTokens.push({
                        email: newEmail,
                        userId: new ObjectId(account._id),
                        token: verifyPin,
                    });

                    // Update item in the database
                    account.updateDatabaseItem((success2) => {
                        if (success2) {
                            res.redirect(routes.dashboard);

                            // Begin the email transition
                            const emailTransition = new EmailTransition(
                                oldEmail,
                                newEmail
                            );
                            emailTransition.insertDatabaseItem((success3) => {
                                if (success3) {
                                } else {
                                }
                            });
                        } else
                            res.render(
                                views.genericError,
                                new DatabaseErrorTransformer(
                                    "Could not update account info"
                                )
                            );
                    });
                });
            } else {
                if (req.body.line1) {
                    account.address = new Address({
                        line1: req.body.line1,
                        line2: req.body.line2,
                        city: req.body.city,
                        state: req.body.state,
                        zip: req.body.zip,
                    });
                }

                account.phone = req.body.phone;

                account.updateDatabaseItem((success) => {
                    if (success) res.redirect(routes.dashboard);
                    else
                        res.render(
                            views.genericError,
                            new DatabaseErrorTransformer(
                                "Could not update account info"
                            )
                        );
                });
            }
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

AccountRouter.post("/update-goal", (req, res) => {
    const routeLog: RouterLogger = new RouterLogger("/app/account", req);
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
        routeLog.logAccountAndSessionFetchResult(accountSession);
        if (accountSession) {
            accountSession.account.currentGoal = req.body.goal;
            accountSession.account.objective = req.body.objective;
            accountSession.account.updateDatabaseItem((success) => {
                if (success) {
                    res.redirect(routes.dashboardCard.goals);
                } else {
                    res.render(
                        views.genericError,
                        new DatabaseErrorTransformer("Could not update goal ")
                    );
                }
            });
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

AccountRouter.post("/login", (req, res) => {
    const routeLog: RouterLogger = new RouterLogger("/app/account/login", req);
    Account.loadFromDatabase(req.body.email, (account) => {
        if (account) {
            comparePasswordWithHash(
                req.body.password,
                account.password,
                (correctPassword) => {
                    if (correctPassword) {
                        const session: Session = new Session(account);
                        res.cookie("session", session.key);
                        session.insertDatabaseItem((isSessionAdded) => {
                            if (isSessionAdded) res.redirect(routes.dashboard);
                            else
                                res.render(
                                    views.genericError,
                                    new DatabaseErrorTransformer(
                                        "Could not create a new session."
                                    )
                                );
                        });
                    } else {
                        res.render(views.genericError, {
                            error: "Wrong Password",
                            message:
                                "You entered an incorrect password. Passwords are case sensitive",
                        });
                    }
                }
            );
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

AccountRouter.get("/logout", (req, res) => {
    const routeLog: RouterLogger = new RouterLogger("/app/account/logout", req);
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
        const routeLog: RouterLogger = new RouterLogger(
            "/app/account/profile-pic/change",
            req
        );
        const destination = "/tmp/profile_photos";
        const filename = profilePhotoUploads[req.cookies.session];
        const fullpath = path.join(destination, filename);

        AccountSessionTransformer.fetch(
            req.cookies.session,
            (accountSession) => {
                routeLog.logAccountAndSessionFetchResult(accountSession);
                if (accountSession) {
                    uploadProfilePhoto(fullpath, accountSession.account._id);
                    accountSession.account.photo = true;
                    accountSession.account.updateDatabaseItem((success) => {
                        if (success)
                            res.send(
                                "Great! Your profile photo has been updated!"
                            );
                        else
                            res.send(
                                "There seems to be an issue with your account."
                            );
                    });
                } else {
                    res.send("There seems to be an issue with your account.");
                }
            }
        );
    }
);

AccountRouter.get("/my-photo", (req, res) => {
    const routeLog: RouterLogger = new RouterLogger(
        "/app/account/my-photo",
        req
    );
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
        routeLog.logAccountAndSessionFetchResult(accountSession);
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

/**
 * /app/account/verify?token=<token>
 */
AccountRouter.get("/verify", (req, res) => {
    const routeLog: RouterLogger = new RouterLogger("/app/account/verify", req);
    const token: string = req.query.token as string;

    // logger.info(`Verifying account with PIN ${token}`);

    const tokenInfo = verifyEmailTokens.find((verifyObject) => {
        return verifyObject.token === token;
    });

    if (tokenInfo) {
        // logger.info(`Found valid token on server`);
        AccountSessionTransformer.fetch(
            req.cookies.session,
            (accountSession) => {
                routeLog.logAccountAndSessionFetchResult(accountSession);
                if (accountSession && accountSession.account) {
                    //             logger.info(
                    //                 `Found account (${accountSession.account.email}) associated with PIN ${token}
                    // Comparing: ${accountSession.account._id} and ${tokenInfo?.userId}
                    // Comparing: ${accountSession.account.email} and ${tokenInfo?.email}`
                    //             );
                    if (
                        accountSession.account._id.toString() ===
                            tokenInfo?.userId.toString() &&
                        accountSession.account.email === tokenInfo?.email
                    ) {
                        accountSession.account.emailVerified = true;
                        accountSession.account.updateDatabaseItem((success) => {
                            if (success) {
                                logger.info(
                                    `Account ${accountSession.account.email} has been verified`
                                );

                                // Transition all database documents to use the new email

                                res.redirect("/app/dashboard");
                            } else {
                                logger.info(
                                    `There was an error updating ${accountSession.account.email} to verify the email.`
                                );
                                res.render("errors/UnknownError");
                            }
                        });

                        // Begin transition of all database items with the verified email
                        EmailTransition.loadFromDatabase(
                            accountSession.account.email,
                            (emailTransitionObj) => {
                                if (emailTransitionObj) {
                                    const oldEmail: string =
                                        emailTransitionObj.oldEmail;
                                    const newEmail: string =
                                        emailTransitionObj.newEmail;

                                    // Transition all certifications
                                    Certification.loadFromDatabase(
                                        oldEmail,
                                        (certifications) => {
                                            certifications.forEach(
                                                (certification) => {
                                                    certification.user = newEmail;
                                                    certification.updateDatabaseItem();
                                                }
                                            );
                                        }
                                    );

                                    // Transition all education
                                    Education.loadFromDatabase(
                                        oldEmail,
                                        (edus) => {
                                            edus.forEach((edu) => {
                                                edu.user = newEmail;
                                                edu.updateDatabaseItem();
                                            });
                                        }
                                    );

                                    // Transition all skills
                                    Skill.loadFromDatabase(
                                        oldEmail,
                                        (skills) => {
                                            skills.forEach((skill) => {
                                                skill.user = newEmail;
                                                skill.updateDatabaseItem();
                                            });
                                        }
                                    );

                                    // Transition all work experience
                                    WorkExperience.loadFromDatabase(
                                        oldEmail,
                                        (workHistory) => {
                                            workHistory.forEach((workExp) => {
                                                workExp.user = newEmail;
                                                workExp.updateDatabaseItem();
                                            });
                                        }
                                    );
                                }
                            }
                        );
                    } else {
                        logger.info(
                            `Account ${accountSession.account.email} did not match the verification ID`
                        );
                        res.render("errors/UnknownError");
                    }
                } else {
                    res.render("errors/UnknownError");
                }
            }
        );
    } else {
        res.render("errors/UnknownError");
    }
});

AccountRouter.get("/resend-verification", (req, res) => {
    const routeLog: RouterLogger = new RouterLogger(
        "/app/account/resend-verification",
        req
    );
    AccountSessionTransformer.fetch(req.cookies.session, (accountSession) => {
        routeLog.logAccountAndSessionFetchResult(accountSession);
        if (accountSession && accountSession.account) {
            const account = accountSession.account;

            // Send an email verification email
            const emailer = new VerifyEmailer(account._id);
            let verifyPin = Math.round(Math.random() * 1000000) + "";
            while (verifyPin.length < 6) verifyPin = "0" + verifyPin;
            emailer.sendVerifyEmail(verifyPin);
            verifyEmailTokens.push({
                email: account.email,
                userId: new ObjectId(account._id),
                token: verifyPin,
            });

            res.redirect("/app/account");
        }
    });
});

export default AccountRouter;
