# FitFlow Deployment Guide

## Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Firebase project setup
- Git & GitHub account

## Step 1: MongoDB Atlas Setup

1. Create account at mongodb.com/cloud/atlas
2. Create new project and cluster
3. Add database user with strong password
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/fitness-tracker`
5. Whitelist your IP addresses

## Step 2: Firebase Setup

1. Go to firebase.google.com
2. Create new project
3. Enable Email/Password authentication
4. Go to Project Settings
5. Create service account key (JSON)
6. Copy the following values to .env:
   - project_id → FIREBASE_PROJECT_ID
   - private_key → FIREBASE_PRIVATE_KEY
   - client_email → FIREBASE_CLIENT_EMAIL

## Step 3: Backend Deployment (Railway)

1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Add environment variables in Railway dashboard
4. Railway auto-deploys on push
5. Get backend URL: `https://your-app.railway.app`

## Step 4: Frontend Deployment (Vercel)

1. Import GitHub repo in Vercel
2. Set environment variable:
   - NEXT_PUBLIC_API_URL=https://your-app.railway.app/api
3. Deploy

## Step 5: Database Seeding

After backend is deployed:

\`\`\`bash
# Local
npm run seed

# Or via API
curl -X POST https://your-app.railway.app/api/gyms \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Gym Name","address":"...","coordinates":[-74,40],...}'
\`\`\`

## Environment Variables Checklist

### Backend (.env)
- [ ] MONGODB_URI
- [ ] FIREBASE_PROJECT_ID
- [ ] FIREBASE_PRIVATE_KEY
- [ ] FIREBASE_CLIENT_EMAIL
- [ ] PORT (default: 5000)
- [ ] NODE_ENV (production)
- [ ] FRONTEND_URL

### Frontend (.env.local)
- [ ] NEXT_PUBLIC_API_URL (backend URL)

## Monitoring

### Backend (Railway)
- Check logs: Railway dashboard
- Monitor performance: Railway metrics

### Frontend (Vercel)
- Check logs: Vercel dashboard
- Monitor performance: Vercel analytics

### Database (MongoDB)
- Monitoring tab in Atlas
- Set up alerts for high connections

## Scaling Considerations

### Database
- MongoDB connection pooling
- Indexing optimization
- Sharding for large datasets

### API
- Load balancing
- Caching with Redis
- Rate limiting

### Frontend
- CDN for static assets
- Image optimization
- Code splitting

## Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify Firebase credentials
- Check Node version compatibility

### Frontend API errors
- Verify NEXT_PUBLIC_API_URL
- Check CORS settings
- Test endpoint directly

### Database connection issues
- Check IP whitelist in MongoDB
- Verify credentials
- Check network connectivity

## Security Best Practices

1. Store secrets in environment variables
2. Enable HTTPS/SSL
3. Set strong database passwords
4. Limit database access by IP
5. Use role-based access control
6. Implement rate limiting
7. Enable audit logging
8. Regular security updates
