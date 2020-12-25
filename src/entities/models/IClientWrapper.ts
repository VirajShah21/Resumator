import ResumeInfoTransformer from '@transformers/ResumeInfoTransformer';
import Account from '@entities/Account';
import Session from '@entities/Session';

export default interface IClientWrapper {
    account: Account;
    session: Session;
    resumeInfo: ResumeInfoTransformer;
}
