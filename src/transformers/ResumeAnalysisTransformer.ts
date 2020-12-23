import Account from '@entities/Account';
import GoalParser from '@shared/util/GoalParser';
import { IGoalResults, ISuggestion } from '@shared/util/GoalInterfaces';
import ResumeInfoTransformer from '@transformers/ResumeInfoTransformer';

export default class ResumeAnalysisTransformer {
    public requirements: ISuggestion[];
    public tips: ISuggestion[];
    public strength: {
        education: number;
        work: number;
        skills: number;
        certifications: number;
        overall: number;
    };

    constructor(account: Account, resumeInfo: ResumeInfoTransformer) {
        let parser: (resumeInfo: ResumeInfoTransformer) => IGoalResults;

        // If a goal is set, then set the parser to the defined parser, otherwise set
        // it to a function which returns NO requirement errors or tips.
        if (account.currentGoal)
            parser = GoalParser.getGoalParser(account.currentGoal);
        else
            parser = (reusmeInfo: ResumeInfoTransformer) => {
                return {
                    requirements: [],
                    tips: [],
                };
            };

        const results: IGoalResults = parser(resumeInfo);

        this.strength = {
            education: 100,
            work: 100,
            skills: 100,
            certifications: 100,
            overall: 100,
        }; // defaults until calculation

        // Cut strength by 2.5 for missing requirements
        results.requirements.forEach((requirement) => {
            this.penalize(requirement.for, requirement.penalty || 2.5);
        });

        // Cut strength by a mere 1.5 for passive tips
        results.tips.forEach((tip) => {
            this.penalize(tip.for, tip.penalty || 1.5);
        });

        this.requirements = results.requirements;
        this.tips = results.tips;

        this.strength.overall =
            (this.strength.certifications +
                this.strength.education +
                this.strength.skills +
                this.strength.certifications) /
            4;
    }

    public penalize(category: string, penalty: number): void {
        switch (category) {
            case 'education':
                this.strength.education /= penalty;
                break;
            case 'work':
                this.strength.work /= penalty;
                break;
            case 'skills':
                this.strength.skills /= penalty;
                break;
            case 'certifications':
                this.strength.certifications /= penalty;
                break;
            default:
                break;
        }
    }
}
