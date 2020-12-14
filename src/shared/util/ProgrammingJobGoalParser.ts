import ResumeInfoTransformer from "@transformers/ResumeInfoTransformer";
import { ISuggestion, IGoalResults } from "./GoalInterfaces";

export default class ProgrammingJobGoalParser {
    public static readonly requiredEducation: ISuggestion = {
        for: "education",
        message:
            "Although an education is not required to land a programming job, it is when the rest of your resume is mostly empty.",
        penalty: 5,
    };

    public static readonly requiredSkills: ISuggestion = {
        for: "skills",
        message:
            "You can't get a job without any skills you're proficient in! List more proficient skills",
    };

    public static readonly skillsTip: ISuggestion = {
        for: "skills",
        message: "You should add more skills to strengthen your resume",
    };

    public static readonly workExperienceTip: ISuggestion = {
        for: "work",
        message:
            "Adding (more relative) prior work experience will significantly improve your resume",
    };

    public static readonly educationTip: ISuggestion = {
        for: "education",
        message:
            "A strong education is not required for a programming job... but it certainly helps a lot.",
    };

    public static readonly certificationsTip: ISuggestion = {
        for: "certifications",
        message:
            "Certifications help prove you qualification to potential employers. Consider signing up for some coding bootcamps or certification exams/programs.",
    };

    public static readonly requiredProgrammingLanguages: ISuggestion = {
        for: "skills",
        message:
            "Add 5 programming languages, frameworks, or libraries which you are proficient in.",
    };

    public static handle(resumeInfo: ResumeInfoTransformer): IGoalResults {
        const results: IGoalResults = { requirements: [], tips: [] };

        if (
            resumeInfo.educationHistory.length === 0 &&
            resumeInfo.workExperience.length <= 2 &&
            resumeInfo.certifications.length <= 2
        )
            results.requirements.push(
                ProgrammingJobGoalParser.requiredEducation
            );

        if (resumeInfo.educationHistory.length === 0)
            results.tips.push(ProgrammingJobGoalParser.educationTip);

        if (
            resumeInfo.skillset.filter((skill) => {
                return skill.proficiency > 66;
            }).length === 0
        )
            results.requirements.push(ProgrammingJobGoalParser.requiredSkills);

        if (
            resumeInfo.skillset.filter((skill) => {
                return skill.proficiency > 66;
            }).length < 5
        )
            results.tips.push(ProgrammingJobGoalParser.skillsTip);

        if (resumeInfo.workExperience.length < 2)
            results.tips.push(ProgrammingJobGoalParser.workExperienceTip);

        if (resumeInfo.certifications.length === 0)
            results.tips.push(ProgrammingJobGoalParser.certificationsTip);

        if (resumeInfo.skillset.length < 5)
            results.requirements.push(
                ProgrammingJobGoalParser.requiredProgrammingLanguages
            );

        return results;
    }
}
