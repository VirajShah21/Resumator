import ResumeInfoTransformer from '@transformers/ResumeInfoTransformer';
import { IGoalResults } from './GoalInterfaces';
import ProgrammingJobGoalParser from './ProgrammingJobGoalParser';
import UGInternshipGoalParser from './UGInternshipGoalParser';

export const goalsList: { name: string; label: string }[] = [
    { name: 'ug-internship', label: 'Undergraduate Internship' },
    { name: 'programming-job', label: 'Software Programming Job' },
];

/**
 *
 * @param resumeInfo Returns blank requirements and tips
 */
function handleUndefinedGoal(resumeInfo: ResumeInfoTransformer): IGoalResults {
    return { requirements: [], tips: [] };
}

export default class GoalParser {
    public static getGoalParser(
        name: string
    ): (resumeInfo: ResumeInfoTransformer) => IGoalResults {
        switch (name) {
            case 'ug-internship':
                return UGInternshipGoalParser.handle;
            case 'programming-job':
                return ProgrammingJobGoalParser.handle;
            default:
                return handleUndefinedGoal;
        }
    }
}
