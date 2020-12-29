import { Router } from 'express';
import { json as bodyParserJson } from 'body-parser';
import { ObjectId } from 'mongodb';
import Skill from '../entities/daos/Skill';
import { views, routes } from '../shared/constants';
import DatabaseErrorTransformer from '../transformers/DatabaseErrorTransformer';
import { getClient } from '../shared/functions';

const DB_ERR = 'Could not delete skill.';
const SkillsRouter = Router();
const jsonParser = bodyParserJson();

SkillsRouter.post('/add', jsonParser, (req, res) => {
    const client = getClient(req);
    if (!client) {
        res.send('Access denied');
        return;
    }
    const skill = new Skill(
        req.body.skill,
        req.body.proficiency,
        client.account.email
    );
    if (req.body.delete === 'on') {
        skill.deleteDatabaseItem((success) => {
            if (success) res.redirect(routes.dashboardCard.skills);
            else
                res.render(
                    views.genericError,
                    new DatabaseErrorTransformer(DB_ERR)
                );
        });
    } else {
        skill.insertDatabaseItem((success) => {
            if (success) res.redirect(routes.dashboardCard.skills);
            else
                res.render(
                    views.genericError,
                    new DatabaseErrorTransformer(DB_ERR)
                );
        });
    }
});

SkillsRouter.post('/update', jsonParser, (req, res) => {
    const client = getClient(req);
    if (!client) {
        res.send('Access denied');
        return;
    }
    const skill = new Skill(
        req.body.skill,
        req.body.proficiency,
        client.account.email
    );
    skill._id = new ObjectId(req.body._id);

    if (req.body.delete === 'on') {
        skill.deleteDatabaseItem((success) => {
            if (success) res.redirect(routes.dashboardCard.skills);
            else
                res.render(
                    views.genericError,
                    new DatabaseErrorTransformer(DB_ERR)
                );
        });
    } else {
        skill.updateDatabaseItem((success) => {
            if (success) res.redirect(routes.dashboardCard.skills);
            else
                res.render(
                    views.genericError,
                    new DatabaseErrorTransformer(DB_ERR)
                );
        });
    }
});

export default SkillsRouter;
