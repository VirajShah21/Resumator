import { Router } from 'express';
import AppRouter from './AppRouter';
import ApiRouter from './api';
import { views } from '@shared/constants';
import AccountSessionTransformer from '@transformers/AccountSessionTransformer';

export const PREFIX = '/';

// Init router and path
const MainRouter = Router();

// Base Routes
MainRouter.get('/', (req, res) => {
    if (req.cookies.session) {
        AccountSessionTransformer.fetch(
            req.cookies.session,
            (accountSession) => {
                if (accountSession && accountSession.account) {
                    res.redirect('/app/dashboard');
                } else {
                    res.render(views.landingPage, {
                        nav: 'Home',
                    });
                }
            }
        );
    } else {
        res.render(views.landingPage, {
            nav: 'Home',
        });
    }
});

// Add sub-routes
MainRouter.use('/app', AppRouter);
MainRouter.use('/api', ApiRouter);

// Export the base-router
export default MainRouter;
