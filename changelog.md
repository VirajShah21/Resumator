# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - UNDEFINED

### Added

-   Website page title (`Resumator` on every page)
-   One more requirement for a software programming job
-   Email verification

### Improvements

-   Fixed `NaN%` issue on certifications strength meter
-   Finished the `Budgie Blue` theme
-   Regular account menu items on help page, when signed in
-   Major UI improvements
    -   Flat navigation bar
    -   Striped resume strength meters
    -   Red/yellow/blue resume strength meters
    -   Redesigned cards for themes page
    -   "Preview" cursor when hovering a theme
    -   Drag & Drop profile picture is bordered with a white fill

### Technical Improvements

-   Created component mixins for resume information cards
-   Created component mixins for progress bar and labels
-   Fixed validators
    -   Entities automatically validate all fields now. Super-class `Entity.ts` automatically finds the validator functions.

## [0.0.5] - 2020-12-02

### Added

-   **API Access to Profile Image** - Images hosted on cloudinary will now show up on the user's dashboard
-   **Beta Flag** - Added the `beta` flag next to the Resumator logo on the navbar

### Improvements

-   **Flatter UI Style** - Removed borders and shadows. The UI instead uses contrasting colors
-   **Redesigned Modal** - Lighter and more fluid and blurry modals
-   **Resigned Resume Strength** - Background on requirement information and tips are lighter; they blend better. Strength meters are redesigned

## [0.0.4] - 2020-09-15

### Added

-   **Overview Card** - Added an overview card with name and profile image
-   **Profile Photo Upload** - Upload a profile photo to be associated with your account and included in the resumes

### Improvements

-   **Theme: Budgie Blue** - Design improvements and added more fields to preview
-   **Theme Page** - Design improvements
    -   Removed "Buy" button (for now) and made the "preview" button blue
    -   Added thumbnails for themes

### Technical Improvements

-   Moved input formatting/validation functions to `AllInput` module
-   Full SonarCloud cleanup

## [0.0.3] - 2020-08-25

### Improvements

-   **Goals** - Added more requirements for undergraduate internship resumes
-   **Resume Strength** - Adjusted point deductions
-   **Technical improvements**
    -   Better development practices & enforcement
    -   Reorganized project
    -   Enhanced validation
    -   Better documentation
-   **Bug Fixes** - SonarCloud CSS bugfix
-   **UI Improvements** - Changed thumbs up indicators for resume strength to smaller circles

## [0.0.2] - 2020-08-23

### Added

-   **Lazy Ass Help** - Provides components on the help page so features can be directly accessed
-   **Sticky Footer** - Added a sticky footer to the bottom

### Improvements

-   **Logo** - New circular and vibrant logo
-   **Navbar** - UI Improvements
    -   Slightly fatter
    -   Added icons
    -   Blue active nav links
    -   Redesigned Alpha badge
-   **Help Pages** - New Help Pages
    -   Add, Edit, or Delete work experience
    -   Add, Edit, or Delete certifications
-   **Resume Strength** - UI Improvements
    -   Fixed alert box padding
    -   Added red, yellow, and green thumbs indicators to resume strength labels

## [0.0.1] - 2020-08-20

### Added

-   Sign Up/Login/Logout
-   Dashboard View
-   Edit Name
-   Edit Phone Number
-   Edit Address
-   Add Education
-   Add Work Experience
-   Add Skills
-   Add Certifications
-   Edit/Delete Education
-   Edit/Delete Work Experience
-   Edit/Delete Skill
-   Edit/Delete Certification
-   Preview Resume Theme
-   Add/Modify Goal
-   Set Objective Statement
-   Resume Strength Meter
-   Resume Suggestions (Requirements/Tips)
-   Help Page
-   Manage Account Settings
