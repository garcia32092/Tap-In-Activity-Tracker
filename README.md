# ActivityTracker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# TO-DO:

Improve charts and how they display data (Work on getting the data for each 24hrs displayed properly. If an event goes passed midnight it should be counted for the appropriate day)

Implement custom time ranges for displaying data on charts

Ensure approach for displaying data is optimal (should calculation for chart data be handled exclusively in backend OR IN DATABASE???)

Add a way to display journals (Either separate component to display for certain days [Perhaps an actual notebook lookalike component where you can flip pages by dates] or add them to calendar somehow)

See if there is a way to make sidebar hide when clicking anywhere on a component page

# DONE:

Implement modal popup saving/deleting activity from calendar views
Create date-utils.ts file in utils folder and move date formatting helper functions to this file
Try to replace modalConent with logActivity form
Add journaling form for each day
Add chart page (various visual displays for all activity data)
Add Tap In page (List of quick one tap buttons for activity start/finish with current times)
Implement double clicking time to add an event/activity
Add activity draggable/resizable/allDay logic to db and handling on calendar (also add check boxes to form for these and remove hardcoded events from calendar code)
Improve charts and how they display data (ensure charts are displaying data against all time available in each time range, ensure categories data is being displayed instead of each activity)