# FitFlow - Complete Fitness Tracker System

A full-stack fitness tracking application with workout logging, gym discovery, face recognition enrollment, and analytics dashboard.

## Project Structure

\`\`\`
project-root/
├── backend/              # Node.js + Express API server
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth & RBAC
│   ├── services/        # Utilities (Face, Geo, Firebase)
│   └── server.js        # Main server file
│
└── web/                 # Next.js 16 Frontend
    ├── app/             # Next.js App Router
    ├── components/      # React components
    ├── lib/             # Utilities
    └── hooks/           # Custom hooks
\`\`\`

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Recharts for analytics

### Backend
- Node.js + Express
- MongoDB Atlas
- Firebase Admin SDK
- Mongoose ORM

### Key Features
- User authentication with Firebase
- Workout tracking with categories
- Geolocation-based gym discovery
- Face recognition enrollment (browser-based)
- Real-time analytics dashboard
- Leaderboard system
- User stats & progress tracking

## Setup Instructions

### 1. Backend Setup

\`\`\`bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and Firebase credentials
npm run dev
\`\`\`

#### Seed Gyms Data
\`\`\`bash
npm run seed
\`\`\`

### 2. Frontend Setup

\`\`\`bash
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
npm run dev
\`\`\`

### 3. Environment Variables

#### Backend (.env)
\`\`\`
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fitness-tracker
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-email
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
\`\`\`

#### Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User Management
- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update profile
- `POST /api/users/face/enroll` - Enroll face biometric
- `POST /api/users/face/verify` - Verify face for login

### Workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts` - List user's workouts
- `GET /api/workouts/stats/breakdown` - Get workout stats by category

### Gyms
- `GET /api/gyms/near` - Find nearby gyms (lat, lng, km)
- `GET /api/gyms` - Get all gyms
- `GET /api/gyms/:id` - Get gym details
- `POST /api/gyms` - Create gym (admin)

### Analytics
- `GET /api/analytics/leaderboard` - Get calorie leaderboard
- `GET /api/analytics/active-users` - Get active users trend
- `GET /api/analytics/user-stats` - Get user statistics

## Database Models

### User
- uid (Firebase UID)
- email
- displayName
- role (admin, trainer, member)
- stats (total workouts, calories, duration)
- faceTemplates (array of embeddings)

### Workout
- userId (ref to User)
- exerciseName
- category (cardio, strength, flexibility, sports)
- duration
- caloriesBurned
- sets, reps, weight
- notes
- date

### Gym
- name, address, contact
- location (GeoJSON Point)
- amenities
- rating
- hours
- members, trainers

### SessionEvent
- userId (ref to User)
- eventType (login, workout_created, face_verify, etc.)
- metadata
- timestamp

## Features

### 1. Authentication
- Mock Firebase integration
- Email/password signup & login
- JWT-based API authentication
- Persistent sessions

### 2. Dashboard
- User statistics cards (total workouts, calories, streak)
- Weekly activity chart
- Exercise type breakdown
- Recent workouts list
- Leaderboard

### 3. Workout Tracking
- Log exercises with duration & calories
- Support for strength training (sets, reps, weight)
- Flexible categories
- Notes for each workout

### 4. Gym Finder
- Geolocation-based search
- Nearby gyms within 5km radius
- Gym details (hours, amenities, contact)
- MongoDB 2dsphere geospatial queries

### 5. Face Recognition
- Browser-based face capture (video stream)
- Simulate face embedding collection
- Backend storage of biometric templates
- Face verification for authentication

### 6. Analytics
- Real-time user statistics
- Calorie leaderboard (weekly/monthly)
- Active users trends
- MongoDB aggregation pipelines

## Development Notes

### Frontend Architecture
- Server components for auth checks
- Client components for interactive features
- API client utility for backend calls
- Auth context for state management
- Tailwind CSS for responsive design

### Backend Architecture
- Express middleware for auth & RBAC
- MongoDB geospatial indexing for gym search
- Firebase Admin SDK for token verification
- Session event tracking for analytics
- Error handling middleware

### Security
- Bearer token authentication
- Firebase Admin SDK verification
- Role-based access control (RBAC)
- Input validation
- CORS configuration

## Production Deployment

### Frontend (Vercel)
\`\`\`bash
npm run build
vercel deploy
\`\`\`

### Backend (Heroku/Railway)
\`\`\`bash
git push heroku main
\`\`\`

### Database (MongoDB Atlas)
- Create production cluster
- Configure IP whitelist
- Setup automated backups

### Firebase
- Setup production Firebase project
- Enable Email authentication
- Configure web app

## Testing

### Manual Testing
1. Sign up new account
2. Log workout
3. Search nearby gyms
4. Enroll face
5. Check analytics

### API Testing
\`\`\`bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"uid":"user123","email":"user@email.com"}'

# Create workout
curl -X POST http://localhost:5000/api/workouts \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"exerciseName":"Run","duration":30,"caloriesBurned":300,"category":"cardio"}'
\`\`\`

## License

MIT
