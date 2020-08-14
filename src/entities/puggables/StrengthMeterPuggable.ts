import ResumeInfoPuggable from "./ResumeInfoPuggable";

export default class StrengthMeterPuggable {
    public goalName: string;
    public resumeInfo: ResumeInfoPuggable;
    public educationStrength: IResumeStrength;
    public workStrength: IResumeStrength;
    public skillsStrength: IResumeStrength;
    public certificationsStrength: IResumeStrength;

    private constructor(
        goalName: string,
        resumeInfo: ResumeInfoPuggable,
        strengths: {
            educationStrength: IResumeStrength;
            workStrength: IResumeStrength;
            skillsStrength: IResumeStrength;
            certificationsStrength: IResumeStrength;
        }
    ) {
        this.goalName = goalName;
        this.resumeInfo = resumeInfo;
        this.educationStrength = strengths.educationStrength;
        this.workStrength = strengths.workStrength;
        this.skillsStrength = strengths.skillsStrength;
        this.certificationsStrength = strengths.certificationsStrength;
    }

    public static fetch(email: string, callback: (puggable: StrengthMeterPuggable) => void): void {
        ResumeInfoPuggable.fetch(email, (resumeInfo) => {
            // TODO: Calculate strength
            // let goal = goals.find((currGoal) => {
            // TODO: Add goals to resume info
            // return currGoal.name === "goal";
            // });
        });
    }
}

export const goals: IGoal[] = [
    {
        name: "Internship (Undergraduate)",
        requirements: {
            education: [
                {
                    description:
                        "Current (or most recent) undergraduate education is required when applying for internships",
                    gt: 0,
                    properties: { level: "Undergraduate" },
                },
            ],
            work: [],
            skills: [],
            certifications: [],
        },
        suggestions: {
            education: [
                {
                    description: "If you attended a good high school, listing it on your resume could strengthen it",
                    gt: 0,
                    properties: { level: "High School" },
                },
            ],
            work: [
                {
                    description:
                        "If you have any previous work experience related to your internship prospects, adding it could help your chances",
                    gt: 0,
                    properties: {},
                },
            ],
            skills: [
                {
                    description:
                        "The resume should list (at least 5) relevant skills which can be applied towards the internship",
                    gt: 4,
                    properties: {},
                },
            ],
            certifications: [],
        },
    },
];

export interface IGoal {
    name: string;
    requirements: IResumeStandardMap;
    suggestions: IResumeStandardMap;
}

export interface IResumeStandardMap {
    education: IResumeStandard[];
    work: IResumeStandard[];
    skills: IResumeStandard[];
    certifications: IResumeStandard[];
}

export interface IResumeStandard {
    gt?: number;
    eq?: number;
    lt?: number;
    properties: any;
    description: string;
}

export interface IResumeStrength {}
