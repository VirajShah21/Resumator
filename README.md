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

## Features List

|                    | Feature                | Description                              | Notes |
| ------------------ | ---------------------- | ---------------------------------------- | ----- |
| :white_check_mark: | Login/Signup           | Create an account or login               |       |
| :white_check_mark: | Dashboard              | Access the user dashboard                |       |
| :white_check_mark: | Edit Name/Email        | Edit first, last Name, and email address |       |
| :x:                | Edit Phone Number      | Edit phone number                        | \*1   |
| :white_check_mark: | Edit Address           | Edit address (up to the state level)     |       |
| :white_check_mark: | Education History      | Add/Modify/Delete education history      | \*2   |
| :white_check_mark: | Work Experience        | Add/Modify/Delete work experience        | \*2   |
| :white_check_mark: | Skills                 | Add/Modify/Delete skills                 | \*2   |
| :white_check_mark: | Certifications         | Add/Modify/Delete Certification          | \*2   |
| :white_check_mark: | Render Resume Template | Display resume previews                  | :new: |

**Longer Notes**

1. Editing phone numbers does not actually work.
2. Deleting item does not work

## Common Resolutions

### MongoDB

If you get this:

```bash
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
