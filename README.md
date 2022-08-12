# PIIQUANTE

This is the back end server for Project 6 of the Web Developer path.


## Requirements


Node.js, version: 16.14.0 LTS or later
npm, version 8.3.1 or later
nodemon, 2.0.19 or later
MongoDB
Postman



## Getting started


Clone this repo. From the root directory, run:
```bash 
npm install 
``` 
then: 
```bash 
nodemon server 
``` 

The server should run on localhost with default port 3000.
Create your own ``.env`` file, copy the variables from ``.env.example`` file and set its own value.

## Front-end

The front-end can be found in [this repository](https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6).


To use, open new terminal from the root of the front-end directory, run:
```bash 
npm install
``` 
then:
```bash
npm start
```
It should be run on localhost port 4200.



## Usage


Using Postman or Postwoman... to test this API. Token for authentification will be required, you'll need to /signup and /login first to test the rest of routes.

Routes can be tested:


| name  |      method   |  URI | description |
|----------|:-------------:|------:|------:|
| signup | POST   | /api/auth/signup/  |   create an user |
| login| POST  |  /api/auth/login/  |   login to account |
|readUser |GET | /api/auth/| return user's data|
| exportData | GET  | /api/auth/export /  |  export user's data to a .txt file |
| updateUser | PUT | /api/auth/ |  update user's data |
| deleteUser | DELETE | /api/auth/ |   delete user |
| readOneSauce | GET | /api/sauces/:id |  return the chose sauce |
| readSauces | GET | /api/sauces/ |   return all available sauces |
| createSauce | POST | /api/sauces/ |   create a new sauce|
| likeSauce | POST | /api/sauces/:id/like/ |  Like or dislike chosen sauce|
| updateSauce | PUT | /api/sauces/:id/ |   update sauce's information|
| deleteSauce | DELETE | /api/sauces/:id/ |   delete chosen sauce|



The API works with MongoDB NoSQL database. Signup on [MongoDB website](https://www.mongodb.com/cloud/atlas/register) to get your srv, then add it as value of MONGO_URI in your ```.env``` file. 


