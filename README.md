# QCFirst

Link to Website: <https://qcfirst.herokuapp.com/>

## Contributors

### - Anthony Lombardo (Rockergamer321)

### Contributions

Anthony Lombardo

Created and coded

- student-center.html
- faculty-center.html
- course-search.html
- settings.html

Styled previously mentioned HTML files with

- css/user-styles.css

student-center.html and faculty-center are also styled with

- css/center-styles.css

course-search.html is also styled with

- css/course-styles.css

settings.html is also styled with

- css/settings-styles.css

### - Jonathan Dinh (jonathanmdinh)

### Contributions

Jonathan Dinh

Created and coded

- index.html
- student-signup.html
- teacher-signup.html
- createaclass.html
- successful-signup.html

Styled previously mentioned HTML files with

- css/styles.css

In server.js:

- installed and saved packages: express, mongoose, and passport.
- connected to MongoDB Atlas database using mongose.connect().
- hosted website on Heroku using app.listen() and a newly created Procfile.
  - This also required the use of the Heroku CLI.
- added functionality to both student and teacher signup forms, allowing users to be added to the MongoDB database using the given forms.
  - Added schemas for both user types in model.js, ensuring that an email can only exist once in the database.
- Added functionality to createaclass.html form, allowing a class to be added to the database using the given form.

Created qcFirst database in MongoDB Atlas with collections: students, teachers, and classes.

## Purpose

QCfirst is a prototype for a college course enrollment website that allows students and teachers to access a variety of features:

### Student Features

- Ability to sign up as a student.: https://qcfirst.herokuapp.com/student-signup.html
- Search for courses.: https://qcfirst.herokuapp.com/course-search.html
- Enroll in courses.: https://qcfirst.herokuapp.com/course-search.html
- Drop enrolled courses.: https://qcfirst.herokuapp.com/student-center.html
- Pay for tuition.: https://qcfirst.herokuapp.com/student-center.html
- Ability to look at schedule.: https://qcfirst.herokuapp.com/student-center.html

### Professor Features

- Ability to sign up and login as a teacher.: https://qcfirst.herokuapp.com/teacher-signup.html
- Ability to create a course.: https://qcfirst.herokuapp.com/createaclass.html
- Ability to look at teaching schedule.: https://qcfirst.herokuapp.com/faculty-center.html

## Home Page

The homepage is a welcome page that allows users to access the login or sign up pages, access the course enrollment page, or access the advising offices page that Queens College offers.

### Homepage Desktop Design

![Home Page Desktop visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Home-Page%20Desktop.png)

### Homepage Tablet Design

![Home Page Tablet visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Home-Page%20Tablet.png)

### Homepage Moble Design

![Home Page Mobile visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Home-Page%20Mobile.png)

## Log In

The login page allows users to access a form that logs them into to their accounts to access student or teacher-specific pages such as the course enrollment page, the account settings page, or the create a class page. The sign up page can also be accessed from this page by clicking "sign up" at the top-left of the page.

### Login Desktop Design

![Login Desktop visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Login%20Desktop.png)

### Login Tablet Design

![Login Tablet visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Login%20Tablet.png)

### Login Mobile Design

![Login Mobile visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Login%20Mobile.png)

## Sign Up

The sign up page allows users to access a form that creates a new account. The login page can also be accessed from this page by clicked "login" at the top-left of the page.

### Sign Up Desktop Design (Renamed to Student-signup)

![Sign Up Desktop visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Sign%20Up%20Desktop.png)

### Sign Up Tablet Design

![Sign Up Tablet visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Sign%20Up%20Tablet.png)

### Sign Up Mobile Design

![Sign Up Mobile visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Sign%20Up%20Mobile.png)

## Create A Class

The create a class page allows teachers to access a form that create a new class.

### Create A Class Desktop Design

![Create A Class Desktop visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Create%20A%20Class%20Desktop.png)

### Create A Class Tablet Design

![Create A Class Tablet visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Create%20A%20Class%20Tablet.png)

### Create A Class Mobile Design

![Create A Class Mobile visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Create%20A%20Class%20Mobile.png)

## Course Search

The course search page allows the user to view information about available classes of a given name and semester.

### Course Search Desktop Design

![Course Search Desktop visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Course%20Search%20-%20Desktop.png)

### Course Search Tablet Design

![Course Search Tablet visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Course%20Search%20-%20Tablet.png)

### Course Search Mobile Design

![Course Search Mobile visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Course%20Search%20-%20Mobile.png)

## Faculty Center

The Faculty Center allows teachers to view their schedule, create a class, edit a class, or access blackboard.

### Faculty Center Desktop Design

![Faculty Center Desktop visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Faculty%20Center%20-%20Desktop.jpg)

### Faculty Center Tablet Design

![Faculty Center Tablet visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Faculty%20Center%20-%20Tablet.jpg)

### Faculty Center Mobile Design

![Faculty Center Mobile visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Faculty%20Center%20-%20Mobile.png)

## Student Center

The Student Center allows students to access the course search, Blackboard, Degreeworks, and financial aid pages. Additionally, they will be able to see their schedules for the current semester, if they have holds on their account, and if they have any outstanding balances that need to be paid.

### Student Center Desktop Design

![Student Center Desktop visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Student%20Center%20-%20Desktop.png)

### Student Center Tablet Design

![Student Center Tablet visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Student%20Center%20-%20Tablet.png)

### Student Center Mobile Design

![Student Center Mobile visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/Student%20Center%20-%20Mobile.png)

## User Settings

The User Settings page allows a user to access the information that the system currently has about them, such as their current name, email, phone number, and I.D. number. Additionally, they will be able to change their email or phone number through this page.

### User Settings Desktop Design

![User Settings Desktop visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/User%20Settings%20-%20Desktop.png)

### User Settings Tablet Design

![User Settings Tablet visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/User%20Settings%20-%20Tablet.png)

### User Settings Mobile Design

![User Settings Mobile visual design](https://github.com/Rockergamer321/qcfirst/blob/main/Visual%20Designs/User%20Settings%20-%20Mobile.png)

## Design Differences (Jonathan Dinh)

- Login / Signup pages: The login and sign up buttons remained in the same place as the homepage, rather than on top of the border of the form container. This decision was made to keep the positioning of the buttons throughout the pages consistent, rather than have them change from one page to the next.
- student-signup.html: A link to a new html file, teacher-signup was created to help with managing the database tables.
- teacher-signup.html: Created to help with managing the database tables on signup.
- signup-successful.html: Created as a way to tell users that they have successfully signed up. If the signup was not successful, an error will be thrown.
- login.html: The final design of the mobile login page includes the Queens College logo at the top left. The initial visual design took into account, the lack of space on the screen, which  led to the decision of removing the logo. However, after completing the code for this design, it was concluded that there was enough space for the logo to remain, ultimately improving the design.
- student-signup.html / teacher-signup.html: Similarly to the mobile design for the login page, the Queens College logo was kept in the sign up mobile design, straying from the initial visual designs.

## Design Differences (Anthony Lombardo)

- Student Center Page: This page in its current state is very similar to the initial design. However, there are changes in terms of the Class (or rather the Course) section of the design. Initially, the design used a grid, which explains the open spaces shown. I replaced the grid with a table, in order to not make the schedule appear awkward to users. Also, I added a dropdown list on the top right of the Course section to select between different semesters. I've also included an option (Notified Courses) that shows a table consisting of courses where the student clicked the notification bell on. This table works similarly to the enroll page on CUNYFirst where the student can enroll or remove a course from the table by clicking on the notification bell to unnotify them about that course. The last update I've made to the design was an info button that displays more information about the course, along with a drop course button (In case, the student wants to drop the course in question). Lastly, the mobile design has been updated where the table is able to display more information.
- Faculty Center Page: Much like the Student Center page, the current state is very similar to the initial design. Also, the changes to the design are very similar to the changes I've made to the Student Center design where I changed out a grid for a table, along with including a dropdown list and an info button that works similarly to the Student Center Page.
- Course Search Page: For the desktop and tablet design of the Course Search Page, I added a notification button where students can save a course for later and view the course in their notified courses table on the Student Center page. For the mobile design of the Course Search Page, I added the notification bell on the top right of the Select Class section, along with an availability status section that is located on the bottom left. This informs the students is the course that they selected in the dropdown list is available or not. Also, it should come as no surprise that I changed every instance of the word "class" with "course"
- Settings Page: For the Setting Page, I did not really change anything from the initial design since the design itself was simplistic to begin with. I might remove the notifications section if I do not have enough time to implement that feature to our website, but overall, the current design is the same as the initial design.
