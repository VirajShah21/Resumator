import ResumeInfo from "@entities/ResumeInfoPuggable";

export interface ISuggestion {
    for: string;
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
                return UGInternship.handle;
            default:
                return handleUndefinedGoal;
        }
    }
}

class UGInternship {
    public static readonly requiredUndergrad: ISuggestion = {
        for: "education",
        message:
            "When applying for an undergraduate internship, it is required that you have at least one undergraduate education listed",
    };

    public static readonly requiredSkills: ISuggestion = {
        for: "skills",
        message:
            "You should have at least 5 skills... an internship is a job, where you use your existing skills to learn your field more in depth!",
    };

    public static readonly highSchoolTip: ISuggestion = {
        for: "education",
        message: "Adding a high school to your resume would strengthen your education history",
    };

    public static readonly previousWorkTip: ISuggestion = {
        for: "work",
        message:
            "Listing any previous work experience (even if irrelevant) could increase your chances of landing your next job",
        helpLink: "#",
        helpMessage: "What work experience should I list?",
    };

    public static readonly certificationTip: ISuggestion = {
        for: "certifications",
        message:
            "Adding a certification to your resume will make you stand out, especially as an undergrad. Find a course online, learn a little, and get certified!",
    };

    public static handle(resumeInfo: ResumeInfo): IGoalResults {
        const results: IGoalResults = { requirements: [], tips: [] };

        if (
            resumeInfo.educationHistory.length === 0 ||
            resumeInfo.educationHistory.filter((edu) => {
                return edu.level === "Undergraduate";
            }).length === 0
        )
            results.requirements.push(UGInternship.requiredUndergrad);

        if (
            resumeInfo.skillset.filter((skill) => {
                return skill.proficiency >= 0.67;
            }).length < 5
        )
            results.requirements.push(UGInternship.requiredSkills);

        if (
            resumeInfo.educationHistory.filter((edu) => {
                return edu.level === "High School";
            }).length === 0 &&
            resumeInfo.educationHistory.length > 0
        )
            results.tips.push(UGInternship.highSchoolTip);

        if (resumeInfo.workExperience.length === 0) results.tips.push(UGInternship.previousWorkTip);

        if (resumeInfo.certifications.length === 0) results.tips.push(UGInternship.certificationTip);

        return results;
    }
}

function handleUndefinedGoal(resumeInfo: ResumeInfo): IGoalResults {
    return { requirements: [], tips: [] };
}
