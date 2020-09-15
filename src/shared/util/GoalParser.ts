import ResumeInfoTransformer from "@transformers/ResumeInfoTransformer";
import { IGoalResults, ISuggestion } from "./GoalInterfaces";
import UGInternship from "./UGInternship";

export const goalsList: { name: string; label: string }[] = [
    { name: "ug-internship", label: "Undergraduate Internship" },
    { name: "ug-job", label: "Undergraduate Job" },
];

export default class GoalParser {
    public static getGoalParser(name: string): (resumeInfo: ResumeInfoTransformer) => IGoalResults {
        switch (name) {
            case "ug-internship":
                return UGInternship.handle;
            default:
                return handleUndefinedGoal;
        }
    }
}

class UGJob {
    public static handle(resumeInfo: ResumeInfoTransformer) {
        // TODO: Complete this
    }
}

/**
 *
 * @param resumeInfo Returns blank requirements and tips
 */
function handleUndefinedGoal(resumeInfo: ResumeInfoTransformer): IGoalResults {
    return { requirements: [], tips: [] };
}
