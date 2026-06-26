# Shine Associates Real Estate Portal

## Overview

Shine Associates Real Estate Portal is a full-stack web application developed using React, FastAPI, and MySQL. The platform allows users to browse property listings, register accounts, manage their own properties, and contact property owners through an inquiry system. Administrators have additional privileges to manage users, properties, and inquiries.

This project demonstrates modern full-stack web development concepts including authentication, REST APIs, database integration, and cloud deployment.

---

## Features

### User Features

* User Registration
* Secure Login using JWT Authentication
* Forgot Password using Security PIN
* Profile Management
* Browse Property Listings
* Search Properties
* View Property Details
* Add Property
* Edit Property
* Delete Own Property
* Contact Property Owner

### Administrator Features

* Secure Admin Login
* View All Users
* View All Properties
* View All Buyer Inquiries
* Delete Any Property
* Delete User Accounts

---

## Technologies Used

### Frontend

* React
* Vite
* React Router
* Axios
* CSS

### Backend

* FastAPI
* SQLAlchemy
* JWT Authentication
* Passlib
* Pydantic

### Database

* MySQL (Aiven Cloud)

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Aiven

---

## Project Structure

frontend/

* React Application
* UI Components
* Authentication
* Dashboard
* Property Management

backend/

* FastAPI REST APIs
* Database Models
* CRUD Operations
* Authentication
* User Management

---

## REST APIs

* User Registration
* User Login
* Forgot Password
* Profile Update
* Property CRUD
* Property Search
* Inquiry Management
* Admin APIs

---

## Authentication

JWT-based authentication has been implemented.

Two roles are supported:

* User
* Admin

Protected routes require a valid JWT token.

---

## Database

MySQL database is managed using SQLAlchemy ORM.

Tables include:

* Users
* Properties
* Inquiries

---

## Deployment

Frontend deployed using Vercel

Backend deployed using Render

Database hosted on Aiven MySQL

##NOTE 
--- Free deployment services are used therefore speed is very slow .

## Learning Outcomes

This project demonstrates:

* Full Stack Development
* REST API Design
* Database Integration
* JWT Authentication
* CRUD Operations
* Role-Based Access Control
* Cloud Deployment
* Git and GitHub Workflow
