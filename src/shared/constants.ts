export const passwordSaltRounds = 10;
export const keygenChars = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const views = {
    dashboard: "dashboard",
    // unknownError: "errors/UnknownError",
    genericError: "errors/GenericError",
    accountPage: "account",
    landingPage: "landing",
};

export const routes = {
    dashboard: "/app/dashboard",
    dashboardCard: {
        workExperience: "/app/dashboard#work-experience-card",
        education: "/app/dashboard#education-card",
        certification: "/app/dashboard#certifications-card",
        skills: "/app/dashboard#skills-card",
    },
};
