# Resumator [![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/dashboard?id=VirajShah21_Resumator)

![CI](https://github.com/VirajShah21/Resumator/workflows/CI/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=VirajShah21_Resumator&metric=alert_status)](https://sonarcloud.io/dashboard?id=VirajShah21_Resumator)

Resumator creates resumes, and stuff like that.

## ExpressJS Project Setup

### Routes

The base router is found in `src/routes/index.ts`. All subroutes are created in a separate file and implemented as middlewar in the base router.

`src/Server.ts` contains the main process, and the base router is called upon from there. ExpressJS configuration should be done in Server.ts

### Views

Views are written in Pug (formerly Jade). Components to be included are in `src/views/components`. The resume templates are included in `src/views/resume-templates`.

### TypeScript Paths

-   `src/entities` - entities, such as items stored in a database are declared as classes in this directory.

An example of a User entity :

```typescript
// User.ts
export default class User {
    public id: string;
    public email: string;
    public passwordHash: string;

    constructor(id?: string, email?: string, passwordHash?: string) {
        this.id = id ? id : "";
        this.email = email ? email : "";
        this.passwordHash = passwordHash ? passwordHash : "";
    }
}
```

-   `src/routes` - this contains the express routes. [Read More](#routes)

-   `src/shared` - this contains some components which are shared throughout the project.

This directory contains three main files:

    - `constants.ts`: This file `export`s string or number constants
    - `functions.ts`: This file contains miscellaneous functions (usually utility methods)
    - `Logger.ts`: This exports a logger which should be used instead of `console.log` on the server side

-   `src` - this contains the files pertaining to the main process of the server application

## Code Style

This project is being scanned on SonarCloud. Crappy code is frowned upon.

Analysis by **SonarCloud**

Linter (for IDEs) **TSLint, SonarLint**

### Data Access Objects

Before a database entry is updated, all fields should be validated using `{DAO}.validate(): boolean`. Common methods for entities are the following:

-   `public static loadFromDatabase(lookup: any, callback: (results: any) => void): void`
-   `public static insertDatabaseItem(callback: (success: boolean) => void): void`
-   `public static updateDatabaseItem(callback: (success: boolean) => void): void`

... although they are not required

## Configuration Files

**package.json**

Configuration for `node`, `npm`, `nodemon`, and supplemental for `typescript` and `sonarlint`/`sonarcloud`.

**sonar-project.properties**

Contains matching information for SonarCloud analysis

**tsconfig.json**

> TypeScript configuration

**tsconfig.prod.json**

The production configuration for TypeScript. Also used for `npm run test`

**tslint.json**

The linter rules for TypeScript

## Issues & Tasks

-   :red_circle: Missing delete Skill
-   :red_circle: Missing delete Education
-   :red_circle: Missing delete Work Experience
-   :black_circle: Some entities may not have any doc comments
-   :black_circle: Non-entities have no doc comments
-   :red_circle: Editing phone number does not do anything
-   :black_circle: Account entity should record phone number
-   :red_circle: Implement validation in all forms

> **Key**
>
> :red_circle: = functionality issue **or** missing functionality  
> :white_circle: = UI issue **or missing component**  
> :black_circle: = code quality issue
> :beetle: = bug

## Features List

-   **Login/Signup** - Click on "Get Started" (when on the landing page) or navigate to `/app/account`.
-   **Access the dashboard** - Click on "Dashboard" in the navigation menu or click on `/app/dashboard`.
-   **Modify Personal Information** - Navigate to the dashboard and find the card labeled "Personal Information". There, you can modify your first name, last name, email, phone, and address.
-   **Add/Edit Education History** - Navigate to the dashboard and find the card labeled "Education".
-   **Add/Edit Work Experience** - Navigate to the dashboard and find the card labeled "Work Experience"
-   **Add/Edit Skills** - Navigate to the dashboard and find the card labeled "Skills". You can add skills by clicking the blue button labeled "Add Skill". You can adjust proficiency in the modal when adding or editing skills. To edit a skill, click on its pill badge.
-   **Render Resume Template** - Navigate to `/app/themes` or click on "Themes" in the navigation menu. Then select a theme and click on the button labeled "Preview".

## Testing Procedures

**Login/Signup**

1. **Sign up (unique email ID):** Should create a new account and redirect to the dashboard
2. **Sign up with the same email**: Should display an account doesn't exist error
3. **Sign up with mismatching passwords**: Should display a password mismatch error

**Access the dashboard**

The following cards should be displayed:

-   Personal Information
    -   All data which has been previously set should be filled in
-   Education
    -   List with education history
    -   Add education button
-   Work Experience
    -   List with work experience
    -   Add work experience button
-   Skills
    -   Should display skills
    -   Skills should be rendered using red, yellow, and green respective to proficiency
    -   Skills should be shown from green to red
    -   Add skills button

**Modify Personal Information**

1. **Change all information + submit**: Should change all fields
2. **Change no information + submit**: Should change **NO** fields
