[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/bukotsunikki.svg?style=social&label=Follow%20%40triquetrx)](https://twitter.com/triquetrx)

# Movies Booking App

This is backend of the application created by Zaid Khan(Triquetrx)
Created using: NodeJs, ExpressJS, MongoDB
Module used for logging: Winston
FrameWork used for testing: Jest

## Application Details:

The application consists of two main roles ADMIN and USER; the user is allowed to book the movie tickets, the booking information will consists of "movieName", "theatreId", "showTime", "numberOfTickets", "seatNumbers" and "totalCost", in order to book it the api they need to use is ":movieName/add" and even if the user is not logged in then too they can browse the movies available.
The ADMIN on the other hand can add new movies, actors starring in the movie and the theatre it will be in, these theatre will also have show time and number of seats for that show, the user can opt for the seat in the same way, if the demand is high for a show then they can add more seats to the same & if the demand is low then they can remove the seats from the same. Also the theatres can be added only by the admin and not by the user

## Application Routes:

All the routes begin with /api/v1.0/moviebooking followed by the action user wants to take, below mentioned consists of ACTION: HTTP_METHOD: ROUTE

### Login Routes:

Register: POST: /register
Login: POST: /login
Forgot Password: GET: /:username/forgot
Reset Password: PUT: /:resetToken/reset
Give Admin Access (Only Admin can access): GET: /admin-access/:loginId

### Movie Routes:

Get all Movies: GET: /all
Search Movie by name: GET: /search/:movieName
Add new Movie (admin access required): POST: /add-new-movie
Delete Movie (admin access required): DELETE: /:movieName/delete

### Actor Routes:

Add Actor(admin access required): POST: /add-actor
Get All Actors: GET: /all-actors

### Theatre Routes:

Add new theatre (admin access required): POST: /add-new-theatre
Get All Theatres: GET: /all-theatre
Add or remove Theatre shows seats for a movie (admin access required): PUT: /:movieName/update

### Booking Routes (Login Required):

Book Ticket: POST: /:movieName/add
Get My Booking: GET: /my-bookings

## Run the code

- Run npm install which will install all the dependecies
- Run npm start to start application @ 3000 or create env file and set "PORT"
- Run npm test to run all the test cases which will use port 3001
