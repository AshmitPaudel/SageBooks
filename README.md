# Welcome to SageBooks
SageBooks is an online bookstore built with Django and React. It offers a comprehensive catalog of books, user authentication, order management, reviews, and more—offering a seamless and interactive user experience.

## **Prerequisites:**
- Git – for cloning the repository
- Python – for the Django backend
- Node.js & npm – for the React frontend
- PostgreSQL – for the database 
- pgAdmin (optional) – GUI for managing PostgreSQL

## **To set it up locally, follow the steps below:**

- Clone the Repository:
git clone https://github.com/AshmitPaudel/SageBooks.git

## Backend Setup:
- Set up a Virtual Environment:

- Navigate to the backend directory:
  cd backend

- Create and activate a virtual environment:
  
   • Windows:
    python -m venv venv
    .\venv\Scripts\activate
    
    • macOS/Linux:
      python3 -m venv venv
      source venv/bin/activate

- Install  Dependencies:
  pip install -r requirements.txt

- Make Migrations:
  python manage.py migrate

- Run the Backend Server:
  python manage.py runserver


## Frontend Setup
- Navigate to Frontend Directory:
  cd /frontend

- Install Frontend Dependencies:
  npm install

- Start the frontend server:
  npm start













   
   
