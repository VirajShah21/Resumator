import ResumeInfo from "@entities/ResumeInfoPuggable";

export interface ISuggestion {
    message: string;
    helpLink?: string;
    helpMessage?: string;
}

export interface IGoalResults {
    requirements: ISuggestion[];
    tips: ISuggestion[];
}

export const goalsList: { name: string; label: string }[] = [
    { name: "ug-internship", label: "Undergraduate Internship" },
];

export default class GoalParser {
    public static getGoalParser(name: string): (resumeInfo: ResumeInfo) => IGoalResults {
        switch (name) {
            case "ug-internship":
                return handleUGIInternship;
            default:
                return handleUndefinedGoal;
        }
    }
}

function handleUGIInternship(resumeInfo: ResumeInfo): IGoalResults {
    const results: IGoalResults = { requirements: [], tips: [] };

    if (
        resumeInfo.educationHistory.length === 0 ||
        resumeInfo.educationHistory.filter((edu) => {
            return edu.level === "Undergraduate";
        }).length === 0
    ) {
        results.requirements.push({
            message:
                "When applying for an undergraduate internship, it is required that you have at least one undergraduate education listed",
        });
    }

    const goodSkills = resumeInfo.skillset.filter((skill) => {
        return skill.proficiency >= 0.67;
    });

    if (goodSkills.length < 5) {
        results.requirements.push({
            message:
                "You should have at least 5 skills... an internship is a job, where you use your existing skills to learn your field more in depth!",
        });
    }

    if (resumeInfo.workExperience.length === 0) {
        results.tips.push({
            message:
                "Listing any previous work experience (even if irrelevant) could increase your chances of landing your next job",
            helpLink: "#",
            helpMessage: "What work experience should I list?",
        });
    }

    return results;
}

function handleUndefinedGoal(resumeInfo: ResumeInfo): IGoalResults {
    return { requirements: [], tips: [] };
}
