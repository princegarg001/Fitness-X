# FitFlow - Getting Started Guide

## Quick Start (Development)

### 1. Clone & Install

\`\`\`bash
# Backend
cd backend
npm install

# Frontend (in another terminal)
npm install
\`\`\`

### 2. Configure Environment

**Backend - create `backend/.env`:**
\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@project.iam.gserviceaccount.com
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
\`\`\`

**Frontend - create `.env.local`:**
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

### 3. Start Development Servers

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
npm run dev
# Server runs at http://localhost:5000
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
npm run dev
# Frontend runs at http://localhost:3000
\`\`\`

### 4. Seed Sample Data

\`\`\`bash
cd backend
npm run seed
# Creates 3 sample gyms in NYC area
\`\`\`

### 5. Test the App

1. Open http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Create account with:
   - Email: test@example.com
   - Name: Test User
   - Password: SecurePass123!
4. Log in
5. Explore features:
   - Dashboard: View stats & charts
   - Log Workout: Add exercise entries
   - Find Gyms: Discover nearby gyms
   - Face Enroll: Register biometric

## Project Structure

### Backend

\`\`\`
backend/
├── server.js                 # Entry point
├── config/
│   └── connection.js         # MongoDB connection
├── models/
│   ├── User.js              # User schema
│   ├── Workout.js           # Workout schema
│   ├── Gym.js               # Gym schema with geospatial
│   └── SessionEvent.js      # Event tracking
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── workoutRoutes.js
│   ├── gymRoutes.js
│   └── analyticsRoutes.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── workoutController.js
│   ├── gymController.js
│   └── analyticsController.js
├── middleware/
│   ├── authMiddleware.js     # Firebase token verification
│   ├── rbacMiddleware.js     # Role-based access control
│   └── errorMiddleware.js    # Error handling
├── services/
│   ├── firebaseAdmin.js      # Firebase integration
│   ├── faceService.js        # Face embedding utilities
│   └── geoService.js         # Geolocation queries
└── scripts/
    └── seed-gyms.js          # Database seeding
\`\`\`

### Frontend

\`\`\`
web/
├── app/
│   ├── page.tsx              # Home/dashboard router
│   ├── layout.tsx            # Root layout with auth
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── signup/
│   │   └── page.tsx          # Signup page
│   └── globals.css           # Tailwind config
├── components/
│   ├── providers/
│   │   └── auth-provider.tsx # Auth context
│   ├── landing-page.tsx      # Marketing homepage
│   ├── dashboard-layout.tsx  # App shell with sidebar
│   ├── dashboard-view.tsx    # Stats & analytics
│   ├── workout-form.tsx      # Workout logging
│   ├── gym-finder.tsx        # Gym discovery
│   └── face-enrollment.tsx   # Biometric registration
├── lib/
│   ├── api-client.ts         # API utilities
│   └── utils.ts              # Helper functions
├── hooks/
│   ├── use-auth.ts           # Already exists (can be deleted)
│   └── use-mobile.ts         # Mobile detection
└── public/
    └── ui/                   # shadcn components
\`\`\`

## Architecture Overview

### Data Flow

\`\`\`
User → Frontend (React) → API Client (Bearer Token)
  → Backend (Express) → Firebase Verification
  → MongoDB (Mongoose) → Response
\`\`\`

### Authentication Flow

1. User signs up with email/password
2. Frontend creates mock Firebase token
3. Sends token to `POST /auth/signup`
4. Backend verifies token with Firebase Admin SDK
5. Creates user in MongoDB
6. Returns user data & token
7. Frontend stores token in localStorage
8. Token sent with subsequent API requests

### Geolocation Flow

1. Frontend requests user's location (browser Geolocation API)
2. Sends lat/lng to `GET /gyms/near?lat=...&lng=...&km=5`
3. Backend queries MongoDB geospatial index (2dsphere)
4. Returns nearby gyms within 5km radius
5. Frontend displays on map placeholder

### Face Recognition Flow

1. User opens Face Enrollment
2. Browser requests camera access
3. Captures video stream
4. Simulates face embedding collection
5. Sends embedding to `POST /users/face/enroll`
6. Backend stores embedding in user.faceTemplates
7. Enrollment complete

## API Response Format

### Success Response
\`\`\`json
{
  "user": {
    "id": "507f...",
    "uid": "firebase_uid",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "member"
  }
}
\`\`\`

### Error Response
\`\`\`json
{
  "error": "Error message describing what went wrong",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
\`\`\`

## Database Indexes

The system automatically creates these indexes:

\`\`\`javascript
// Gyms - Geospatial
db.gyms.createIndex({ "location": "2dsphere" })

// SessionEvents - Time series
db.sessionevents.createIndex({ "createdAt": 1 })

// Workouts - User & Date
db.workouts.createIndex({ "userId": 1, "date": -1 })
\`\`\`

## Common Issues & Solutions

### "CORS error"
- Check FRONTEND_URL in backend .env
- Verify NEXT_PUBLIC_API_URL in frontend

### "Cannot find module firebase-admin"
- Run `npm install` in backend directory

### "MongoDB connection refused"
- Check MONGODB_URI in .env
- Verify whitelist IP in MongoDB Atlas

### "Camera permission denied"
- Check browser security settings
- Use HTTPS (required for camera access in production)

### "Face enrollment fails"
- Enable camera permissions
- Check browser console for detailed error

## Next Steps

1. ✓ Backend API fully functional
2. ✓ Frontend components connected to API
3. Ready to deploy:
   - Setup MongoDB Atlas cluster
   - Setup Firebase project
   - Deploy backend (Railway/Heroku)
   - Deploy frontend (Vercel)

See `DEPLOYMENT.md` for production deployment guide.

## Support

For issues or questions:
1. Check error messages in browser console
2. Check backend logs: `npm run dev` output
3. Verify environment variables
4. Check MongoDB Atlas connection string

## Performance Tips

### Frontend
- Images are optimized with Next.js
- Code splitting automatic
- Tailwind CSS purges unused styles
- Use React.memo for expensive components

### Backend
- MongoDB indexes on frequently queried fields
- Connection pooling enabled
- Gzip compression on responses
- Error handling prevents crashes

### Database
- 2dsphere index for geospatial queries
- TTL indexes for session cleanup
- Compound indexes for common queries

## Security Reminders

1. Never commit .env files
2. Rotate Firebase private keys regularly
3. Use strong MongoDB passwords
4. Enable MongoDB IP whitelist
5. Use HTTPS in production
6. Set secure JWT secrets

Happy coding! 🚀
