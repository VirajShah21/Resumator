import { Router } from 'express';
import { json as bodyParserJson } from 'body-parser';
import Certification from '@entities/Certification';
import { views, routes } from '@shared/constants';
import DatabaseErrorTransformer from '@transformers/DatabaseErrorTransformer';
import { ObjectId } from 'mongodb';
import { getClient } from '@shared/functions';

const CertificationRouter = Router();
const jsonParser = bodyParserJson();

CertificationRouter.post('/add', jsonParser, (req, res) => {
    const client = getClient(req);
    if (!client) {
        res.send('Access denied');
        return;
    }
    const certification = new Certification({
        _id: new ObjectId(),
        institution: req.body.institution,
        certification: req.body.certification,
        details: req.body.details,
        examDate: req.body['exam-date'],
        user: client.account.email,
    });

    certification.insertDatabaseItem((success) => {
        if (success) res.redirect(routes.dashboardCard.certification);
        else
            res.render(
                views.genericError,
                new DatabaseErrorTransformer(
                    'Could not add your certification.'
                )
            );
    });
});

CertificationRouter.post('/update', jsonParser, (req, res) => {
    const client = getClient(req);
    if (!client) {
        res.send('Access denied');
        return;
    }
    const certification = new Certification({
        _id: req.body._id,
        institution: req.body.institution,
        certification: req.body.certification,
        details: req.body.details,
        examDate: req.body['exam-date'],
        user: client.account.email,
    });

    if (req.body.delete === 'on') {
        certification.deleteDatabaseItem((success) => {
            if (success) res.redirect(routes.dashboardCard.certification);
            else
                res.render(
                    views.genericError,
                    new DatabaseErrorTransformer(
                        'Could not delete the certificate.'
                    )
                );
        });
    } else {
        certification.updateDatabaseItem((success) => {
            if (success) res.redirect(routes.dashboardCard.certification);
            else
                res.render(
                    views.genericError,
                    new DatabaseErrorTransformer(
                        'Could not update the certificate.'
                    )
                );
        });
    }
});

export default CertificationRouter;
