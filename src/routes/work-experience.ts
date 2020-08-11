import { Router } from "express";
import BodyParser from "body-parser";
import Account from "@entities/Account";
import Session from "@entities/Session";
import WorkExperience from "@entities/WorkExperience";
import { ObjectId } from "mongodb";
import { views } from "@shared/constants";

const router = Router();
const jsonParser = BodyParser.json();

router.post("/add", jsonParser, (req, res) => {
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
                    });
                }
            });
        } else {
            res.render(views.unknownError);
        }
    });
});

router.post("/update", (req, res) => {
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

            if (req.body.delete === "on") {
                experience.deleteDatabaseItem(() => {
                    res.redirect("/app/dashboard#work-experience-card");
                });
            } else {
                experience.updateDatabaseItem(() => {
                    res.redirect("back");
                });
            }
        } else {
            res.render(views.unknownError);
        }
    });
});

export default router;
