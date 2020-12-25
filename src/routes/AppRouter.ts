import { Router } from 'express';
import { json as bodyParserJson } from 'body-parser';
import AccountRouter from './AccountRouter';
import WorkExperienceRouter from './WorkExperienceRouter';
import EducationRouter from './EducationRouter';
import SkillsRouter from './SkillsRouter';
import CertificationRouter from './CertificationRouter';
import ThemesRouter from './ThemesRouter';
import { views } from '@shared/constants';
import ResumeInfoTransformer from '@transformers/ResumeInfoTransformer';
import AccountSessionTransformer from '@transformers/AccountSessionTransformer';
import { goalsList } from '@shared/util/GoalParser';
import ResumeAnalysisTransformer from '@transformers/ResumeAnalysisTransformer';
import path from 'path';
import Account from '@entities/Account';
import Session from '@entities/Session';
import { getClient } from '@shared/functions';
import WorkExperience from '@entities/WorkExperience';
import Education from '@entities/Education';
import Skill from '@entities/Skill';
import Certification from '@entities/Certification';
import AwardsRouter from './AwardsRouter';

export const PREFIX = '/app';
export const ROOT_DIR = path.join(__dirname, '..');
const AppRouter = Router();

const jsonParser = bodyParserJson();

AppRouter.use((req, res, next) => {
    if (req.cookies.session) {
        AccountSessionTransformer.fetch(
            req.cookies.session,
            (accountSession) => {
                if (
                    accountSession &&
                    accountSession.account &&
                    accountSession.session
                ) {
                    const client: {
                        account: Account;
                        session: Session;
                        resumeInfo: ResumeInfoTransformer;
                    } = {
                        account: accountSession.account as Account,
                        session: accountSession.session as Session,
                        resumeInfo: new ResumeInfoTransformer(
                            [],
                            [],
                            [],
                            [],
                            []
                        ),
                    };

                    ResumeInfoTransformer.fetch(
                        accountSession.account.email,
                        (resumeInfo) => {
                            client.resumeInfo = resumeInfo as ResumeInfoTransformer;
                            Object.defineProperty(req, 'client', {
                                value: client,
                                writable: true,
                            });
                            next();
                        }
                    );
                } else {
                    res.cookie('session', '', {
                        expires: new Date(Date.now()),
                    });
                    res.redirect('/');
                }
            }
        );
    } else {
        next();
    }
});

AppRouter.get('/dashboard', (req, res) => {
    const client = getClient(req);

    if (!client) {
        res.redirect('/');
        return;
    }

    const data: {
        workExperience: WorkExperience[];
        educationHistory: Education[];
        skillset: Skill[];
        certifications: Certification[];
        session?: Session;
        account?: Account;
        nav?: string;
        goalsList?: { name: string; label: string }[];
        analysis?: ResumeAnalysisTransformer;
    } = client.resumeInfo || {};
    data.session = (client.session as unknown) as Session; // Hacky fix
    data.account = client.account;
    data.nav = 'Dashboard';
    data.goalsList = goalsList;
    data.analysis = new ResumeAnalysisTransformer(
        client.account,
        client.resumeInfo
    );

    res.render(views.dashboard, data);
});

AppRouter.use('/account', AccountRouter);
AppRouter.use('/work-experience', WorkExperienceRouter);
AppRouter.use('/education', EducationRouter);
AppRouter.use('/skills', SkillsRouter);
AppRouter.use('/certifications', CertificationRouter);
AppRouter.use('/awards', AwardsRouter);
AppRouter.use('/themes', ThemesRouter);

AppRouter.get('/help', (req, res) => {
    const client = getClient(req);

    if (client && client.account && client.resumeInfo) {
        if (req.query.page) {
            // Route to specific help page
            const data: {
                workExperience: WorkExperience[];
                educationHistory: Education[];
                skillset: Skill[];
                certifications: Certification[];
                helpPage?: string;
                nav?: string;
                account?: Account;
            } = client.resumeInfo;
            data.helpPage = req.query.page as string;
            data.nav = 'Help';
            data.account = (client.account as unknown) as Account;

            res.render('help', data);
        } else {
            // Route to main help page
            res.render('help', {
                nav: 'Help',
                account: client.account,
            });
        }
    } else res.redirect('/');
});

export default AppRouter;
