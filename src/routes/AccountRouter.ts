import { Response, Router } from 'express';
import { json as bodyParserJson } from 'body-parser';
import Session from '../entities/daos/Session';
import Account from '../entities/daos/Account';
import {
    hashPassword,
    comparePasswordWithHash,
    generateVerifyPin,
    getClient,
    assertGoodClient,
    assertDefined,
} from '../shared/functions';
import Address from '../entities/models/Address';
import { views, routes } from '../shared/constants';
import SessionErrorTransformer from '../transformers/SessionErrorTransformer';
import DatabaseErrorTransformer from '../transformers/DatabaseErrorTransformer';
import { ObjectId } from 'mongodb';
import multer from 'multer';
import path from 'path';
import { exec } from 'child_process';
import fs from 'fs';
import { uploadProfilePhoto } from '../shared/cloud';
import logger from '../shared/Logger';
import { VerifyEmailer } from '../shared/util/Emailer';
import EmailTransition from '../entities/daos/EmailTransition';
import Certification from '../entities/daos/Certification';
import Education from '../entities/daos/Education';
import Skill from '../entities/daos/Skill';
import WorkExperience from '../entities/daos/WorkExperience';

const AccountRouter = Router();

AccountRouter.use(bodyParserJson());

export const profilePhotoUploads: unknown = {};
export const verifyEmailTokens: VerifyEmailToken[] = [];

export interface VerifyEmailToken {
    email: string;
    userId: ObjectId;
    token: string;
}

export function sendVerificationEmail(account: Account) {
    const emailer = new VerifyEmailer(account._id);
    const verifyPin = generateVerifyPin();
    emailer.sendVerifyEmail(verifyPin);
    verifyEmailTokens.push({
        email: account.email,
        userId: new ObjectId(account._id),
        token: verifyPin,
    });
}

export function refactorAccountEmailInDatabase(
    oldEmail: string,
    newEmail: string
) {
    // Transition all certifications
    Certification.loadFromDatabase(oldEmail, (certifications) => {
        certifications.forEach((certification) => {
            certification.user = newEmail;
            certification.updateDatabaseItem(() => {
                // Certification transitioned
            });
        });
    });

    // Transition all education
    Education.loadFromDatabase(oldEmail, (edus) => {
        edus.forEach((edu) => {
            edu.user = newEmail;
            edu.updateDatabaseItem(() => {
                // Education transitioned
            });
        });
    });

    // Transition all skills
    Skill.loadFromDatabase(oldEmail, (skills) => {
        skills.forEach((skill) => {
            skill.user = newEmail;
            skill.updateDatabaseItem(() => {
                // Skill transitioned
            });
        });
    });

    // Transition all work experience
    WorkExperience.loadFromDatabase(oldEmail, (workHistory) => {
        workHistory.forEach((workExp) => {
            workExp.user = newEmail;
            workExp.updateDatabaseItem(() => {
                // Work Experience transitioned
            });
        });
    });
}

// Setup temp storage directory
exec('mkdir /tmp', () => {
    if (!fs.existsSync('/tmp')) {
        logger.error('Could not create /tmp');
    } else {
        logger.info('Created /tmp');
        exec('mkdir /tmp/profile_photos', () => {
            if (!fs.existsSync('/tmp/profile_photos')) {
                logger.error('Could not create /tmp/profile_photos');
            } else {
                logger.info('Created /tmp/profile_photos');
            }
        });
    }
});

AccountRouter.get('/', (req, res) => {
    const client = getClient(req);
    if (client && client.account) {
        res.render('manage-account', {
            nav: 'Account',
            account: client.account,
        });
    } else {
        res.render(views.accountPage, {
            nav: 'Account',
        });
    }
});

AccountRouter.post('/signup', (req, res) => {
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
                            sendVerificationEmail(account);
                            res.cookie('session', session.key);
                            res.redirect(routes.dashboard);
                        } else {
                            res.render(
                                views.genericError,
                                new DatabaseErrorTransformer(
                                    'Could not create a new session. Your account was created, however, you will need to login manually.'
                                )
                            );
                        }
                    });
                } else {
                    res.render(
                        views.genericError,
                        new DatabaseErrorTransformer(
                            'Could not create a new account.'
                        )
                    );
                }
            });
        });
    } else {
        res.render(views.genericError, {
            error: `Passwords don't match`,
            message:
                'Your password and confirmation password do not match. Please make sure they are typed exactly the same. Passwords are case sensitive',
        });
    }
});

/**
 * Helper method to transition an account to a new email
 *
 * @param accountUpdated True if the account update was successful
 * @param oldEmail The previous email
 * @param newEmail The new email
 * @param res The express response object, to send the final response to
 */
function beginEmailTransition(
    accountUpdated: boolean,
    oldEmail: string,
    newEmail: string,
    res: Response
): void {
    if (accountUpdated) {
        res.redirect(routes.dashboard);

        // Begin the email transition
        const emailTransition = new EmailTransition(oldEmail, newEmail);
        emailTransition.insertDatabaseItem(() => {
            logger.info(
                `Transitioning account from ${oldEmail} -> ${newEmail}`
            );
        });
    } else
        res.render(
            views.genericError,
            new DatabaseErrorTransformer('Could not update account info')
        );
}

AccountRouter.post('/update', (req, res) => {
    const client = getClient(req);

    assertGoodClient(client);

    const account: Account = client.account;

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
            if (success) res.cookie('session', newSession.key);

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
            sendVerificationEmail(account);

            // Update item in the database
            account.updateDatabaseItem((success2) => {
                assertDefined(success2);
                beginEmailTransition(success2, oldEmail, newEmail, res);
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
                        'Could not update account info'
                    )
                );
        });
    }
});

AccountRouter.post('/update-goal', (req, res) => {
    const account = getClient(req)?.account;
    if (account) {
        account.currentGoal = req.body.goal;
        account.objective = req.body.objective;
        account.updateDatabaseItem((success: boolean) => {
            if (success) res.redirect(routes.dashboardCard.goals);
            else
                res.render(
                    views.genericError,
                    new DatabaseErrorTransformer('Could not update goal ')
                );
        });
    }
});

AccountRouter.post('/login', (req, res) => {
    Account.loadFromDatabase(req.body.email, (account) => {
        if (account) {
            comparePasswordWithHash(
                req.body.password,
                account.password,
                (correctPassword) => {
                    if (correctPassword) {
                        const session: Session = new Session(account);
                        res.cookie('session', session.key);
                        session.insertDatabaseItem((isSessionAdded) => {
                            if (isSessionAdded) res.redirect(routes.dashboard);
                            else
                                res.render(
                                    views.genericError,
                                    new DatabaseErrorTransformer(
                                        'Could not create a new session.'
                                    )
                                );
                        });
                    } else {
                        res.render(views.genericError, {
                            error: 'Wrong Password',
                            message:
                                'You entered an incorrect password. Passwords are case sensitive',
                        });
                    }
                }
            );
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

AccountRouter.get('/logout', (req, res) => {
    res.cookie('session', '', {
        expires: new Date(Date.now()),
    });
    res.redirect('/app/account');
});

AccountRouter.post(
    '/profile-pic/change',
    multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, '/tmp/profile_photos');
            },
            filename: (req, file, cb) => {
                const filename = `${Date.now()}-${file.filename}`;
                Object.defineProperty(
                    profilePhotoUploads,
                    req.cookies.session,
                    {
                        value: filename,
                        writable: true,
                    }
                );
                cb(null, filename);
            },
        }),
        limits: {
            fileSize: 8000000, // Sensitive: 10MB is more than the recommended limit of 8MB
        },
    }).single('file'),
    (req, res) => {
        const client = getClient(req);

        if (client) {
            const destination = '/tmp/profile_photos';
            const filename = Object.getOwnPropertyDescriptor(
                profilePhotoUploads,
                req.cookies.session
            )?.value;
            // const filename = profilePhotoUploads[req.cookies.session];
            const fullpath = path.join(destination, filename as string);
            const account = client.account;

            uploadProfilePhoto(fullpath, account._id);
            account.photo = true;
            account.updateDatabaseItem((success: boolean) => {
                if (success)
                    res.send('Great! Your profile photo has been updated!');
                else res.send('There seems to be an issue with your account.');
            });
        }
    }
);

AccountRouter.get('/my-photo', (req, res) => {
    const client = getClient(req);
    if (client && client.account) {
        if (client.account.photo)
            res.redirect(
                `https://res.cloudinary.com/virajshah/image/upload/v1600066438/profile_photos/${client.account._id}.jpg`
            );
        else res.redirect('https://placehold.it/300x300');
    } else res.redirect('https://placehold.it/300x300');
});

/**
 * /app/account/verify?token=<token>
 */
AccountRouter.get('/verify', (req, res) => {
    const token: string = req.query.token as string;
    const client = getClient(req);
    assertGoodClient(client);

    logger.info(`Verifying account with PIN ${token}`);

    const tokenInfo = verifyEmailTokens.find((verifyObject) => {
        return verifyObject.token === token;
    });

    if (tokenInfo) {
        const account: Account = client.account;

        if (
            account._id.toString() === tokenInfo?.userId.toString() &&
            account.email === tokenInfo?.email
        ) {
            account.emailVerified = true;
            account.updateDatabaseItem((success) => {
                if (success) {
                    logger.info(`Account ${account.email} has been verified`);

                    // Transition all database documents to use the new email

                    res.redirect('/app/dashboard');
                } else {
                    logger.info(
                        `There was an error updating ${account.email} to verify the email.`
                    );
                    res.render('errors/UnknownError');
                }
            });

            // Begin transition of all database items with the verified email
            EmailTransition.loadFromDatabase(
                account.email,
                (emailTransitionObj) => {
                    if (emailTransitionObj) {
                        const oldEmail: string = emailTransitionObj.oldEmail;
                        const newEmail: string = emailTransitionObj.newEmail;
                        refactorAccountEmailInDatabase(oldEmail, newEmail);
                    }
                }
            );
        } else {
            logger.info(
                `Account ${account.email} did not match the verification ID`
            );
            res.render('errors/UnknownError');
        }
    } else res.render('errors/UnknownError');
});

AccountRouter.get('/resend-verification', (req, res) => {
    const account = getClient(req)?.account;

    if (account) sendVerificationEmail(account);

    res.redirect('/app/account');
});

export default AccountRouter;
