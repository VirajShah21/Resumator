import Account from "@entities/Account";
import logger from "@shared/Logger";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const NODEMAILER_SERVICE = process.env.NODEMAILER_SERVICE;
const NODEMAILER_USER = process.env.NODEMAILER_USER;
const NODEMAILER_PASS = process.env.NODEMAILER_PASS;

const transporter = nodemailer.createTransport({
    service: NODEMAILER_SERVICE,
    auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASS,
    },
});

export class VerifyEmailer {
    public user: ObjectId;

    public constructor(user: ObjectId) {
        this.user = user;
    }

    public sendVerifyEmail(tokenString: string): void {
        Account.loadFromDatabaseById(this.user, (account) => {
            if (account && account.email) {
                let html = fs.readFileSync(
                    path.join(
                        process.cwd(),
                        "email_templates/verifyEmail.html"
                    ),
                    "utf-8"
                );

                while (html.indexOf("${verifylink}") >= 0)
                    html = html.replace("${verifylink}", tokenString);

                const emailInfo = {
                    from: "Viraj Shah at Resumator",
                    to: account.email,
                    subject: "Please Verify Your Email",
                    html,
                };

                transporter.sendMail(emailInfo, (err, info) => {
                    if (err) {
                        logger.error(err);
                    } else {
                        logger.info(
                            `Verification email sent to ${account.email}`
                        );
                    }
                });
            }
        });
    }
}
