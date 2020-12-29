import { Router } from 'express';
import { views } from '../shared/constants';
import SessionErrorTransformer from '../transformers/SessionErrorTransformer';
import ResumeInfoTransformer from '../transformers/ResumeInfoTransformer';
import { getClient } from '../shared/functions';

const ThemesRouter = Router();

ThemesRouter.get('/', (req, res) => {
    const client = getClient(req);
    if (!client) {
        res.send('Access denied');
        return;
    }
    if (client && client.account)
        res.render('themes', {
            nav: 'Themes',
            account: client.account,
        });
    else
        res.render('themes', {
            nav: 'Themes',
        });
});

ThemesRouter.get('/preview', (req, res) => {
    const client = getClient(req);
    if (!client) {
        res.send('Access denied');
        return;
    }

    if (client.resumeInfo)
        res.render(`resume-templates/${req.query.theme}`, {
            account: client.account,
            workExperience: client.resumeInfo.workExperience,
            educationHistory: client.resumeInfo.educationHistory,
            skillset: client.resumeInfo.skillset,
            certifications: client.resumeInfo.certifications,
        });
    else res.render(views.genericError, new SessionErrorTransformer());
});

export default ThemesRouter;
