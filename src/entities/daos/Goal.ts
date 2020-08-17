const goals: Goal[] = [
    {
        name: "ug-intern",
        label: "Internship (Undergraduate)",
        educationRequirements: {
            undergrad: 1,
        },
    },
];

export interface Goal {
    name: string;
    label: string;
    educationRequirements: {
        undergrad?: number;
        grad?: number;
        school?: number;
        any?: number;
    };
}
