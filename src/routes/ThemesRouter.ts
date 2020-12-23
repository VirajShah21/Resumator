import { Router } from 'express';
import { views } from '@shared/constants';
import SessionErrorTransformer from '@transformers/SessionErrorTransformer';
import ResumeInfoTransformer from '@transformers/ResumeInfoTransformer';
import AccountSessionTransformer from '@transformers/AccountSessionTransformer';

const ThemesRouter = Router();

ThemesRouter.get('/', (req, res) => {
    if (req.body.client && req.body.client.account)
        res.render('themes', {
            nav: 'Themes',
            account: req.body.client.account,
        });
    else
        res.render('themes', {
            nav: 'Themes',
        });
});

ThemesRouter.get('/preview', (req, res) => {
    ResumeInfoTransformer.fetch(req.body.client.account.email, (resumeInfo) => {
        if (resumeInfo) {
            res.render(`resume-templates/${req.query.theme}`, {
                account: req.body.client.account,
                workExperience: resumeInfo.workExperience,
                educationHistory: resumeInfo.educationHistory,
                skillset: resumeInfo.skillset,
                certifications: resumeInfo.certifications,
            });
        } else {
            res.render(views.genericError, new SessionErrorTransformer());
        }
    });
});

export default ThemesRouter;
