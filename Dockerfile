FROM python:3.8.4 

WORKDIR /backend

ENV PYTHONUNBUFFERED 1 

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver"]


FROM node:16.14.0

WORKDIR /frontend

COPY package.json . 

RUN npm install 

COPY . . 

EXPOSE 3000

CMD ["npm", "start"]


#makefile

help:
	@echo 'build-backend    builds the backend folder'
	@echo 'build-frontend   builds the frontend folder'
	@echo 'run-backend      runs the django backend server'
	@echo 'run-frontend     runs the react app'
	@echo 'clean-backend    removes venv folder'
	@echo 'clean-frontend   removes node_modules folder'

build-backend:
	cd backend && py -m venv venv && venv\Scripts\activate.bat && pip install -r requirements.txt && python manage.py makemigrations && python manage.py migrate

build-frontend:
	cd frontend && npm install 

run-backend:
	cd backend && venv\Scripts\activate.bat && python manage.py runserver

run-frontend:
	cd frontend && npm start

clean-backend:
	cd backend && rmdir /s /q venv

clean-frontend:
	cd frontend && rmdir /s /q node_modules


#docker-compose.yml

version: "1.0"
services:
 frontend_app:
  container_name: frontend_app
  image: frontend_app:react 
  build: ./frontend
  ports:
   - "3000:3000"

 backend_api:
  container_name: backend_api
  image: backend_api:django
  build: ./backend
  ports:
   - "8000:8000"
