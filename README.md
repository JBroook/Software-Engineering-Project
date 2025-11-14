# Digital Asset Management System

A full-stack digital asset storage website built in Next.js and Django by two university students for a course. This project uses the Chakra UI packet, Next.js for frontend and Django Rest Framework for the backend rest API.

## Features
- Upload, store, and manage digital assets  
- Asset tagging and metadata management  
- Search and filtering  
- User authentication and role-based access  
- RESTful API for integration

## Tech Stack

### Frontend
- Next.js  
- TypeScript  
- Chakra UI  

### Backend
- Django  
- Django REST Framework  
- PostgreSQL
- Session-based authentication

## Project Structure
```
software-enginerring-project/
├── frontend/
│ ├── app-frontend/
│ │ ├── app/
│ │ ├── components/
│ │ ├── node-modules/
│ │ └── ...
│ └── ...
└── backend/
│ ├── assets/
│ ├── api/
│ ├── backend/
│ └── ...
```

## Requirements
- Node.js (LTS)  
- Python 3.x  
- PostgreSQL 
- Yarn or npm  
- pipenv

## Installation

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install requirements
   ```bash
   pipenv start
   pipenv install -r requirements.txt
   ```
3. Migrate the database
   ```bash
   py manage.py migrate
   ```
4. Create super user
   ```bash
   py manage.py createsuperuser
   ```
5. Start the backend
   ```bash
   py manage.py runserver
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend/app-frontend
   ```
2. Install dependencies
   ```bash
   npm i
   ```
3. Start the dev server
   ```bash
   npm run dev
   ```
