# Internship Tracker

A full-stack web application for tracking internship applications, interview progress, offers, and rejections.

## Live Demo

Frontend:
https://internship-tracker-flax.vercel.app

Backend API:
https://internship-tracker-production-d24d.up.railway.app/internships

## Features

* Add internship applications
* Edit company and role information
* Update application status
* Delete applications
* Search internships
* Filter by status
* Sort by company and status
* Dashboard analytics
* Status color badges
* Dark mode
* PostgreSQL database persistence
* Cloud deployment

## Tech Stack

### Frontend

* React
* Vite
* CSS

### Backend

* FastAPI
* SQLAlchemy
* Pydantic

### Database

* PostgreSQL

### Deployment

* Railway (Backend + Database)
* Vercel (Frontend)
* GitHub (Version Control)

## Application Architecture

React Frontend

↓

FastAPI REST API

↓

SQLAlchemy ORM

↓

PostgreSQL Database

↓

Railway Cloud Infrastructure

## API Endpoints

### Get All Internships

GET /internships

### Add Internship

POST /internships

### Update Internship

PUT /internships/{id}

### Delete Internship

DELETE /internships/{id}

## Running Locally

### Backend

```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Future Improvements

* User authentication
* Resume upload support
* Application deadlines
* Email reminders
* Analytics dashboard
* AI-powered application insights

## Author

Maruthi Vadlamani

Built as a full-stack portfolio project using React, FastAPI, PostgreSQL, SQLAlchemy, Railway, and Vercel.
