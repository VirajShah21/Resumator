import WorkExperience, { IWorkExperience } from "@entities/WorkExperience";
import Education, { IEducation } from "@entities/Education";
import Skill, { ISkill } from "@entities/Skill";
import Certification, { ICertification } from "@entities/Certification";

export default class ResumeInfo {
    public workExperience: WorkExperience[];
    public educationHistory: Education[];
    public skillset: Skill[];
    public certifications: Certification[];

    constructor(
        workExperience: IWorkExperience[],
        educationHistory: IEducation[],
        skillset: ISkill[],
        certifications: ICertification[]
    ) {
        this.workExperience = workExperience.map((work) => {
            return new WorkExperience(work);
        });
        this.educationHistory = educationHistory.map((education) => {
            return new Education(education);
        });
        this.skillset = skillset.map((skill) => {
            return new Skill(skill);
        });
        this.certifications = certifications.map((certification) => {
            return new Certification(certification);
        });
    }

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
