import Account from "@entities/Account";
import GoalParser from "@shared/util/GoalParser";
import { IGoalResults, ISuggestion } from "@shared/util/GoalInterfaces";
import ResumeInfoTransformer from "@transformers/ResumeInfoTransformer";

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
        if (account.currentGoal) parser = GoalParser.getGoalParser(account.currentGoal);
        else
            parser = (reusmeInfo: ResumeInfoTransformer) => {
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
                    if (requirement.penalty) strength.education /= requirement.penalty;
                    else strength.education /= 2.5;
                    break;
                case "work":
                    if (requirement.penalty) strength.work /= requirement.penalty;
                    else strength.work /= 2.5;
                    break;
                case "skills":
                    if (requirement.penalty) strength.skills /= requirement.penalty;
                    else strength.skills /= 2.5;
                    break;
                case "certifications":
                    if (requirement.penalty) strength.certifications /= requirement.penalty;
                    else strength.certifications /= 2.5;
                    break;
                default:
                    break;
            }
        });

        // Cut strength by a mere 1.1 for passive tips
        results.tips.forEach((tip) => {
            switch (tip.for) {
                case "education":
                    if (tip.penalty) strength.education /= tip.penalty;
                    else strength.education /= 1.5;
                    break;
                case "work":
                    if (tip.penalty) strength.work /= tip.penalty;
                    else strength.work /= 1.5;
                    break;
                case "skills":
                    if (tip.penalty) strength.skills /= tip.penalty;
                    else strength.skills /= 1.5;
                    break;
                case "certifications":
                    if (tip.penalty) strength.certifications /= tip.penalty;
                    else strength.certifications /= 1.5;
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
