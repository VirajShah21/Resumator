# Resumator

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/dashboard?id=VirajShah21_Resumator)

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

## Issues

-   :red_circle: Login has no functionality
-   :beetle: Adding education does not work
-   :red_circle: Missing delete Skill
-   :red_circle: Missing delete Education
-   :red_circle: Missing delete Work Experience
-   :red_circle: Signup should send a verification email
-   :black_circle: Account entity should record if email is verified
-   :white_circle: `<label> ... </label>` font size is too large
-   :white_circle: Font weight is too heavy
-   :white_circle: Landing page is ugly
-   :white_circle: Form labels should be outside of input placeholders in Login/Signup
-   :black_circle: Some entities may not have any doc comments
-   :black_circle: Non-entities have no doc comments
-   :red_circle: Editing phone number does not do anything
-   :black_circle: Account entity should record phone number

> **Key**
>
> :red_circle: = functionality issue  
> :white_circle: = UI issue  
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
