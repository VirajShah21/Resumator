import { Router } from 'express';
import { json as bodyParserJson } from 'body-parser';
import Education from '@entities/Education';
import { ObjectId } from 'mongodb';
import { views, routes } from '@shared/constants';
import SessionErrorTransformer from '@transformers/SessionErrorTransformer';
import DatabaseErrorTransformer from '@transformers/DatabaseErrorTransformer';
import AccountSessionTransformer from '@transformers/AccountSessionTransformer';
import { getClient } from '@shared/functions';

const EducationRouter = Router();
const jsonParser = bodyParserJson();

EducationRouter.post('/add', (req, res) => {
    const client = getClient(req);
    if (!client) {
        res.send('Access denied');
        return;
    }
    const education = new Education({
        _id: new ObjectId(),
        user: client.account.email,
        institution: req.body.institution,
        level: req.body.level,
        degree: req.body.degree,
        start: req.body['start-date'],
        end: req.body['end-date'],
        gpa: req.body.gpa,
        description: req.body.description,
    });
    education.insertDatabaseItem((success) => {
        if (success) res.redirect(routes.dashboardCard.education);
        else
            res.render(
                views.genericError,
                new DatabaseErrorTransformer(
                    'Could not add the education to your dashboard.'
                )
            );
    });
});

EducationRouter.post('/update', (req, res) => {
    const client = getClient(req);
    if (!client) {
        res.send('Access denied');
        return;
    }
    const education = new Education({
        _id: req.body._id,
        user: client.account.email,
        institution: req.body.institution,
        level: req.body.level,
        degree: req.body.degree,
        start: req.body['start-date'],
        end: req.body['end-date'],
        gpa: req.body.gpa,
        description: req.body.description,
    });

    if (req.body.delete === 'on') {
        education.deleteDatabaseItem((success) => {
            if (success) res.redirect(routes.dashboardCard.education);
            else
                res.render(
                    views.genericError,
                    new DatabaseErrorTransformer(
                        'Could not not delete this education.'
                    )
                );
        });
    } else {
        education._id = new ObjectId(req.body._id);
        education.updateDatabaseItem((success) => {
            if (success) res.redirect(routes.dashboardCard.education);
            else
                res.render(
                    views.genericError,
                    new DatabaseErrorTransformer('Could not update education.')
                );
        });
    }
});

export default EducationRouter;
