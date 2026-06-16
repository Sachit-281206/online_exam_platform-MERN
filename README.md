# Online Exam Platform (MERN)

Online Exam Platform is a full-stack MERN application for managing classroom-based online exams. Teachers can create classes, approve student join requests, build exams with both MCQ and theory questions, and review submissions. Students can join classes with a code, take timed exams, and track their results.

## Features

- Role-based authentication for `teacher` and `student`
- JWT-protected backend APIs
- Teacher class creation with unique join codes
- Student class join requests with teacher approval/rejection
- Exam creation with MCQ questions
- Exam creation with theory questions
- Per-question marks
- Exam duration in minutes
- Timed student exam runner
- Automatic grading for MCQ questions
- Manual grading workflow for theory answers
- Student result history with review status
- Teacher results dashboard for exam-wise submissions

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Tailwind CSS
- Recharts

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs

## Project Structure

```text
online_exam_platform-MERN/
|-- backend/
|   |-- config/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- .env.example
|   `-- server.js
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- api.js
|   |   `-- App.jsx
|   `-- package.json
`-- README.md
```

## User Workflows

### Teacher

- Register and log in as a teacher
- Create classes
- Share join codes with students
- Review and approve/reject join requests
- Create exams for a selected class
- Mix MCQ and theory questions in the same exam
- Review student attempts and manually grade theory answers

### Student

- Register and log in as a student
- Join a class using a teacher-provided join code
- Wait for teacher approval
- View available exams for enrolled classes
- Attempt timed exams once
- View completed and pending-review results

## Environment Variables

Create a `.env` file inside `backend/` using [`backend/.env.example`](backend/.env.example).

```env
MONGO_URI=mongodb://127.0.0.1:27017/online_exam
JWT_SECRET=replace_with_a_strong_secret_key
CLIENT_URL=http://localhost:3000
PORT=5000
```

### Frontend environment

The frontend uses:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

This is optional because the app already defaults to `http://localhost:5000/api` in `frontend/src/api.js`.

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd online_exam_platform-MERN
```

### 2. Install dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### 3. Configure environment variables

- Copy `backend/.env.example` to `backend/.env`
- Update `MONGO_URI` and `JWT_SECRET`
- Optionally create `frontend/.env` and set `REACT_APP_API_URL`

### 4. Start the backend

From `backend/`:

```bash
npm run dev
```

The backend runs on `http://localhost:5000`.

### 5. Start the frontend

From `frontend/`:

```bash
npm start
```

The frontend runs on `http://localhost:3000`.

## Available Scripts

### Backend

```bash
npm start
npm run dev
```

### Frontend

```bash
npm start
npm run build
npm test
```

## API Overview

### Auth Routes

- `POST /api/auth/register` - Register as `student` or `teacher`
- `POST /api/auth/login` - Log in and receive JWT
- `GET /api/auth/me` - Fetch current authenticated user

### Class Routes

- `POST /api/classes/create` - Teacher creates a class
- `POST /api/classes/join` - Student sends join request
- `GET /api/classes/requests` - Teacher views pending join requests
- `PUT /api/classes/approve/:id` - Teacher approves a request
- `PUT /api/classes/reject/:id` - Teacher rejects a request
- `GET /api/classes/my-classes` - Student views approved classes
- `GET /api/classes/teacher-classes` - Teacher views created classes

### Exam Routes

- `POST /api/exams/create` - Teacher creates an exam
- `GET /api/exams/class/:classId` - Student views exams for a class
- `GET /api/exams/check-attempt/:examId` - Student checks attempt status
- `GET /api/exams/:id` - Student fetches exam questions
- `POST /api/exams/submit/:id` - Student submits answers
- `GET /api/exams/my-results` - Student views result history
- `GET /api/exams/teacher-class/:classId` - Teacher views exams in a class
- `GET /api/exams/results/:examId` - Teacher views attempt summary
- `GET /api/exams/submission/:examId/:studentId` - Teacher views one submission
- `PUT /api/exams/submission/:examId/:studentId/grade` - Teacher grades theory answers

## Data Model Summary

Core collections used in the backend:

- `User` - stores name, email, hashed password, and role
- `Class` - stores class name, teacher, students, and join code
- `JoinRequest` - tracks pending/approved/rejected student requests
- `Exam` - stores exam metadata and questions
- `Result` - stores answers, score, total marks, and review status

## Current Behavior Notes

- Students can attempt an exam only once
- MCQ answers are graded immediately on submission
- Theory answers stay in `pending_review` until the teacher grades them
- Correct answers are removed from the exam payload sent to students
- Frontend auth state is stored in `localStorage`

## Testing

The frontend includes the default React testing setup, but there are currently no meaningful automated tests implemented in this repository. The backend `test` script is also a placeholder at the moment.

## Future Improvements

- Add automated backend and frontend tests
- Add pagination/filtering for larger class and result datasets
- Add deployment instructions for production
- Add email notifications for approvals and exam events
- Add analytics and performance insights for teachers

## License

This project is created for learning and educational purposes only.