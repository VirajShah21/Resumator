import { Router } from 'express';
import { json as bodyParserJson } from 'body-parser';
import AccountRouter from './AccountRouter';
import WorkExperienceRouter from './WorkExperienceRouter';
import EducationRouter from './EducationRouter';
import SkillsRouter from './SkillsRouter';
import CertificationRouter from './CertificationRouter';
import ThemesRouter from './ThemesRouter';
import { views } from '@shared/constants';
import SessionErrorTransformer from '@transformers/SessionErrorTransformer';
import ResumeInfoTransformer from '@transformers/ResumeInfoTransformer';
import { addToObject } from '@shared/functions';
import AccountSessionTransformer from '@transformers/AccountSessionTransformer';
import { goalsList } from '@shared/util/GoalParser';
import ResumeAnalysisTransformer from '@transformers/ResumeAnalysisTransformer';
import path from 'path';
import logger from '@shared/Logger';
import Account from '@entities/Account';
import Session from '@entities/Session';

export const PREFIX = '/app';
export const ROOT_DIR = path.join(__dirname, '..');
const AppRouter = Router();

const jsonParser = bodyParserJson();

AppRouter.use((req, res, next) => {
    const client: {
        account: Account;
        session: Session;
        resumeInfo: ResumeInfoTransformer;
    } = {
        account: req.body.client.account,
        session: req.body.client.session,
        resumeInfo: new ResumeInfoTransformer([], [], [], []),
    };

    ResumeInfoTransformer.fetch(req.body.client.account.email, (resumeInfo) => {
        client.resumeInfo = resumeInfo;
        req.body.client = client;
        next();
    });
});

AppRouter.get('/dashboard', (req, res) => {
    res.render(
        views.dashboard,
        addToObject(
            {
                session: req.body.client.session,
                account: req.body.client.account,
                nav: 'Dashboard',
                goalsList,
                analysis: new ResumeAnalysisTransformer(
                    req.body.client.account,
                    req.body.client.resumeInfo
                ),
            },
            req.body.client.resumeInfo
        )
    );
});

AppRouter.use('/account', AccountRouter);
AppRouter.use('/work-experience', WorkExperienceRouter);
AppRouter.use('/education', EducationRouter);
AppRouter.use('/skills', SkillsRouter);
AppRouter.use('/certifications', CertificationRouter);
AppRouter.use('/themes', ThemesRouter);

AppRouter.get('/help', (req, res) => {
    if (req.body.client.account && req.body.client.resumeInfo) {
        if (req.query.page) {
            // Route to specific help page
            res.render(
                'help',
                addToObject(
                    {
                        helpPage: req.query.page,
                        nav: 'Help',
                        account: req.body.client.account,
                    },
                    req.body.client.resumeInfo
                )
            );
        } else {
            // Route to main help page
            res.render('help', {
                nav: 'Help',
                account: req.body.client.account,
            });
        }
    } else res.redirect('/');
});

export default AppRouter;
