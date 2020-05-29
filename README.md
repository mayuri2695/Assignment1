# About
This project consist of Rest APIS. Project is about to explore courses.Courses can be searched by anyone without authentication.
Course Details must be added by authenticated admin. Once Admin is authenticated, he can add, update,delete courses. Categories can be added to course. Categories master is maintained separatly. Course Category mapping is also maintained.

Above Project includes Apis for filtering,sorting, add, update,delete,find operation on courses and categories. 

Admin can register himself and login via register and login api.

## Technologies
Project is created with:
* Node Js express framework
* Sql Database
* Passport Auth for authentication

## Setup
To run this project, install it locally using npm
1. npm install
2. node server.js

##Testing
To test the apis,connect to local sql datbase. Register one user though register api and login through login api, and then token which comes in response should be attached as Bearer token in authentication key of header.
