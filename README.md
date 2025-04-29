Welcome To Sage Books 
SageBooks is an online bookstore built with Django and React. It offers a comprehensive catalog of books, user authentication, order management, reviews, and more—offering a seamless and interactive user experience.

Prerequisites:
 • Ensure you have the following installed:
 • Git – for cloning the repository
 • Python – for the Django backend
 • Node.js & npm – for the React frontend
 • PostgreSQL – for databse 
 • pgAdmin (optional) – GUI for managing PostgreSQL
 
To set it up locally, Follow the steps below:

1. Clone the Repository:
git clone https://github.com/AshmitPaudel/SageBooks.git

Backend Setup: 
2. Set up a Virtual Environment:

  2.1 Navigate to the backend directory:
    cd backend

2.2. Create and activate a virtual environment:
  • Windows:
    python -m venv venv
    .\venv\Scripts\activate
  
  • macOS/Linux:
    python3 -m venv venv
    source venv/bin/activate

  2.3. Install  Dependencies:
    pip install -r requirements.txt

  2.4. Make Migrations:
    python manage.py migrate

  2.5. Run the Backend Server:
    python manage.py runserver



Froned Setup: 
7. Navigate to Frontend Directory:
  cd /frontend

8. Install Frontend Dependencies:
  npm install

9.  Start the frontend server:
  npm start









   
   
