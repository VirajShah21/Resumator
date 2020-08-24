# Resumator [![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/dashboard?id=VirajShah21_Resumator)

![CI](https://github.com/VirajShah21/Resumator/workflows/CI/badge.svg) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=VirajShah21_Resumator&metric=alert_status)](https://sonarcloud.io/dashboard?id=VirajShah21_Resumator)

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

-   `constants.ts`: This file `export`s string or number constants
-   `functions.ts`: This file contains miscellaneous functions (usually utility methods)
-   `Logger.ts`: This exports a logger which should be used instead of `console.log` on the server side

-   `src` - this contains the files pertaining to the main process of the server application

## Development Standards

This project is being scanned on SonarCloud. Crappy code is frowned upon.

Analysis by **SonarCloud**

Linter (for IDEs) **TSLint, SonarLint**

### The Changelog

-   Every commit where a visible feature is changed, there should be a matching reference in the changelog
-   Previous sections of the changelog should not be modified. The changelog will be truncated when it becomes very long.

### Build Releases

-   All releases should pass SonarCloud Scans — starting from v0.0.3 (Alpha 3)
-   Releases should contain all changes described in `changelog.md` for **ONLY** the current release
-   Nightly releases should not include an archive of `./dist`
-   Major, Minor, and non-nightly patches should include an archive of `./dist`

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

## Features List

|                    | Feature                                     | Notes | Version Added | Version Updated |
| ------------------ | ------------------------------------------- | ----- | ------------- | --------------- |
| :white_check_mark: | Sign Up                                     |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Login                                       |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Dashboard View                              |       | v0.0.1        | v0.0.2          |
| :white_check_mark: | Edit Name                                   |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Edit Phone Number                           |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Edit Address                                |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Add Education                               |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Add Work Experience                         |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Add Skills                                  |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Add Certifications                          |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Edit/Delete Education                       |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Edit/Delete Work Experience                 |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Edit/Delete Skill                           |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Edit/Delete Certification                   |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Preview Resume Theme                        | IDLE  | v0.0.1        | v0.0.1          |
| :white_check_mark: | Add/Modify Goal                             |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | Set Objective Statement                     |       | v0.0.1        | v0.0.1          |
| :white_check_mark: | View Resume Strength Meter                  |       | v0.0.1        | v0.0.2          |
| :white_check_mark: | View Resume Suggestions (Requirements/Tips) |       | v0.0.1        | v0.0.2          |
| :white_check_mark: | Help Page(s)                                | IDLE  | v0.0.1        | v0.0.2          |
| :white_check_mark: | Manage Account                              | IDLE  | v0.0.1        | v0.0.1          |
| :white_check_mark: | Lazy Ass Help Pages                         | IDLE  | v0.0.2        | v0.0.2          |

## Tasklist

-   Completely document all source code
-   Create better system for resume analysis
-   Combine resume analysis with ResumeInfo puggable

### MongoDB

If you get this:

```
info: Express server started on port: 3000

/Users/viraj/Desktop/Resumator/node_modules/mongodb/lib/core/sdam/topology.js:430
        const timeoutError = new MongoServerSelectionError(
                             ^
MongoServerSelectionError: Authentication failed.
    at Timeout._onTimeout (/Users/viraj/Desktop/Resumator/node_modules/mongodb/lib/core/sdam/topology.js:430:30)
    at listOnTimeout (internal/timers.js:549:17)
    at processTimers (internal/timers.js:492:7)
[nodemon] app crashed - waiting for file changes before starting...
```

Then just run `source ~/.bashrc` making sure the secrets are stored as environment variables
