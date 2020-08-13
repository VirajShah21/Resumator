import WorkExperience, { IWorkExperience } from "@entities/WorkExperience";
import Education, { IEducation } from "@entities/Education";
import Skill, { ISkill } from "@entities/Skill";
import Certification, { ICertification } from "@entities/Certification";

export default class ResumeInfo {
    public workExperience: IWorkExperience[];
    public educationHistory: IEducation[];
    public skillset: ISkill[];
    public certifications: ICertification[];

    constructor(
        workExperience: IWorkExperience[],
        educationHistory: IEducation[],
        skillset: ISkill[],
        certifications: ICertification[]
    ) {
        this.workExperience = workExperience;
        this.educationHistory = educationHistory;
        this.skillset = skillset;
        this.certifications = certifications;
    }
}

export class ResumeInfoAccess {
    public static fetch(email: string, callback: (resumeInfo: ResumeInfo) => void): void {
        WorkExperience.loadFromDatabase(email, (workExperience) => {
            Education.loadFromDatabase(email, (educationHistory) => {
                Skill.loadFromDatabase(email, (skillset) => {
                    Certification.loadFromDatabase(email, (certifications) => {
                        callback(new ResumeInfo(workExperience, educationHistory, skillset, certifications));
                    });
                });
            });
        });
    }
}
