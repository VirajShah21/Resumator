import { Router } from 'express';
import { json as bodyParserJson } from 'body-parser';
import { ObjectId } from 'mongodb';
import { views, routes } from '../shared/constants';
import DatabaseErrorTransformer from '../transformers/DatabaseErrorTransformer';
import { getClient } from '../shared/functions';
import Award from '../entities/daos/Award';

const AwardsRouter = Router();
const jsonParser = bodyParserJson();

AwardsRouter.post('/add', (req, res) => {
    const client = getClient(req);

    if (!client) {
        res.send('Access denied');
        return;
    }

    const award = new Award({
        _id: new ObjectId(),
        user: client.account.email,
        name: req.body['award-name'],
    });

    award.insertDatabaseItem((success) => {
        if (success) res.redirect(routes.dashboardCard.awards);
        else
            res.render(
                views.genericError,
                new DatabaseErrorTransformer(
                    'Could not add the award to your dashboard.'
                )
            );
    });
});

AwardsRouter.post('/update', (req, res) => {
    const client = getClient(req);
    if (!client) {
        res.send('Access denied');
        return;
    }
    const award = new Award({
        _id: req.body._id,
        user: client.account.email,
        name: req.body['award-name'],
    });

    if (req.body.delete === 'on') {
        award.deleteDatabaseItem((success) => {
            if (success) res.redirect(routes.dashboardCard.awards);
            else
                res.render(
                    views.genericError,
                    new DatabaseErrorTransformer(
                        'Could not not delete this award.'
                    )
                );
        });
    } else {
        award._id = new ObjectId(req.body._id);
        award.updateDatabaseItem((success) => {
            if (success) res.redirect(routes.dashboardCard.awards);
            else
                res.render(
                    views.genericError,
                    new DatabaseErrorTransformer('Could not update award.')
                );
        });
    }
});

export default AwardsRouter;
