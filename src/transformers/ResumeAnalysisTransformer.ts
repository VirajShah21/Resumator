import Account from "@entities/Account";
import GoalParser, { IGoalResults, ISuggestion } from "@shared/util/GoalParser";
import ResumeInfo from "@transformers/ResumeInfoTransformer";

export default class ResumeAnalyzerTransformer {
    public requirements: ISuggestion[];
    public tips: ISuggestion[];
    public strength: {
        education: number;
        work: number;
        skills: number;
        certifications: number;
        overall: number;
    };

    constructor(account: Account, resumeInfo: ResumeInfo) {
        let parser: (resumeInfo: ResumeInfo) => IGoalResults;

        // If a goal is set, then set the parser to the defined parser, otherwise set
        // it to a function which returns NO requirement errors or tips.
        if (account.currentGoal) parser = GoalParser.getGoalParser(account.currentGoal);
        else
            parser = (reusmeInfo: ResumeInfo) => {
                return {
                    requirements: [],
                    tips: [],
                };
            };

        const results: IGoalResults = parser(resumeInfo);
        const strength = {
            education: 100,
            work: 100,
            skills: 100,
            certifications: 100,
            overall: 100,
        }; // defaults until calculation

        // Cut strength by 2.5 for missing requirements
        results.requirements.forEach((requirement) => {
            switch (requirement.for) {
                case "education":
                    strength.education /= 2.5;
                    break;
                case "work":
                    strength.work /= 2.5;
                    break;
                case "skills":
                    strength.skills /= 2.5;
                    break;
                case "certifications":
                    strength.certifications /= 2.5;
                    break;
                default:
                    break;
            }
        });

        // Cut strength by a mere 1.1 for passive tips
        results.tips.forEach((tip) => {
            switch (tip.for) {
                case "education":
                    strength.education /= 1.1;
                    break;
                case "work":
                    strength.work /= 1.1;
                    break;
                case "skills":
                    strength.skills /= 1.1;
                    break;
                case "certifications":
                    strength.certifications /= 1.1;
                    break;
                default:
                    break;
            }
        });

        this.requirements = results.requirements;
        this.tips = results.tips;
        this.strength = strength;

        this.strength.overall =
            (this.strength.certifications +
                this.strength.education +
                this.strength.skills +
                this.strength.certifications) /
            4;
    }
}