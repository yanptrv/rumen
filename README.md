# Welcome to RUMEN!

## Description

RUMEN is WEB application that allows you to play a game of chess with your friends. It consists of:

- **GUI** - Allows you to interact with the app, sends requests, checks for illegal moves etc.
- **API** - Controls users' requests and manages the database
- **SERVER** - Hosts the said above parts of the projects and manages sessions

<img src='https://github.com/krispetrov/rumen/blob/dev/doc/RUMEN_Homepage.png?raw=true' width=70% height=70%>

The app originated as a Graduation Project for my Diploma and continues to grow every day since then.
The idea is that it lets you create your own chess room without having to register. After that you can
send your room code to your friend and they can join to play against you.

## Used Technologies

| Technology 🚀 | ❔ I use this for... |
| ------------- | ------------- |
| [React](https://reactjs.org/) | GUI |
| [Django](https://www.djangoproject.com/)  | Server  |
| [Django REST framework](https://www.django-rest-framework.org/) | API |

## Starting the WEB application

There are two ways of running the application:

### 1. Using Docker (Recommended)

- First of all, you need to have Docker installed

     [Install Docker](https://www.docker.com/get-started/)
     
- After you have installed Docker Desktop SignUp/SingIn

- When you are logged in, you need to run the following commands in your terminal:

  1.1 Download/pull the latest version of the app:

     `docker pull krispetrov/rumen:latest`

  1.2 To run the app, you need to execute the following command:

     `docker run -p 8080:8080 --name chess-app krispetrov/rumen:latest`
     
### 2. Install from GitHub

- To install it from github you need to have the following things installed:
  
  2.1 [Python - v3.8.9](https://www.python.org/downloads/release/python-389/) <br>
  2.2 [Node.js - v17.4.0](https://nodejs.org/download/release/v17.4.0/) <br>
  2.3 [Git](https://git-scm.com/downloads)

- When all of the requirements are installed run the following commands in your terminal:

     ```
     git clone https://github.com/krispetrov/rumen.git
     bash ./rumen/install
     python3 manage.py runserver "<ipAddress>:8080"
     ```

## Opening RUMEN

You have successfully installed RUMEN if you followed the steps from above.
To open and use the WEB application, you need to go into your browser and open the following link:
     [RUMEN](http://localhost:8080/)

After that, you will be greeted with the home page.

# ENJOY! 
