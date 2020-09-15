/**
 * The Suggestion interface
 */
export interface ISuggestion {
    for: string;
    message: string;
    helpLink?: string;
    helpMessage?: string;
    penalty?: number;
}

/**
 * The Goal Results interface
 */
export interface IGoalResults {
    requirements: ISuggestion[];
    tips: ISuggestion[];
}
