import ResumeInfoTransformer from '../../transformers/ResumeInfoTransformer';
import Account from '../daos/Account';
import Session from '../daos/Session';

export default interface IClientWrapper {
    account: Account;
    session: Session;
    resumeInfo: ResumeInfoTransformer;
}
