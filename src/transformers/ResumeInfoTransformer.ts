import WorkExperience, { IWorkExperience } from '@entities/WorkExperience';
import Education, { IEducation } from '@entities/Education';
import Skill, { ISkill } from '@entities/Skill';
import Certification, { ICertification } from '@entities/Certification';
import Award, { IAward } from '@entities/Award';
import AwardsRouter from 'src/routes/AwardsRouter';

export default class ResumeInfoTransformer {
    public workExperience: WorkExperience[];
    public educationHistory: Education[];
    public skillset: Skill[];
    public certifications: Certification[];
    public awards: Award[];

    constructor(
        workExperience: IWorkExperience[],
        educationHistory: IEducation[],
        skillset: ISkill[],
        certifications: ICertification[],
        awards: IAward[]
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
        this.awards = awards.map((award) => {
            return new Award(award);
        });
    }

    public static fetch(
        email: string,
        callback: (resumeInfo: ResumeInfoTransformer) => void
    ): void {
        WorkExperience.loadFromDatabase(email, (workExperience) => {
            Education.loadFromDatabase(email, (educationHistory) => {
                Skill.loadFromDatabase(email, (skillset) => {
                    Certification.loadFromDatabase(email, (certifications) => {
                        Award.loadFromDatabase(email, (awards) => {
                            callback(
                                new ResumeInfoTransformer(
                                    workExperience,
                                    educationHistory,
                                    skillset,
                                    certifications,
                                    awards
                                )
                            );
                        });
                    });
                });
            });
        });
    }
}
