# Qraft Academy - Setup Guide

This guide will walk you through setting up the Qraft Academy EdTech platform from scratch.

## Prerequisites

Before starting, ensure you have:

- **Node.js 18+** installed ([nodejs.org](https://nodejs.org))
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary account** (free tier is sufficient for development)
- **Git** (for version control)
- **Code editor** (VS Code recommended)

## Step-by-Step Setup

### 1. Install Dependencies

```powershell
npm install
```

This will install all required packages including:
- Next.js 14
- MongoDB/Mongoose
- NextAuth.js
- Tailwind CSS
- Cloudinary
- And more...

### 2. Setup MongoDB

#### Option A: Local MongoDB

1. Download and install MongoDB Community Edition
2. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
3. MongoDB will run on `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password

### 3. Setup Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Go to Dashboard
4. Note down:
   - Cloud Name
   - API Key
   - API Secret
5. Go to Settings → Upload → Upload Presets
6. Create a new preset:
   - Name: `qraft_academy`
   - Signing Mode: Unsigned
   - Folder: `qraft-academy`

### 4. Configure Environment Variables

1. Copy the example file:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Edit `.env` with your values:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/qraft-academy
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qraft-academy

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-a-random-string

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
CLOUDINARY_API_KEY=your-api-key-here
CLOUDINARY_API_SECRET=your-api-secret-here

# Application
NODE_ENV=development
```

**Generate NEXTAUTH_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Seed the Database

Run the seed script to populate the database with sample data:

```powershell
npm run seed
```

This creates:
- 1 Admin user
- 1 Facilitator user
- 3 Learner users
- 1 Partner organization
- 1 Program
- 3 Sample courses with modules and lessons

**Test Credentials:**
```
Admin:       admin@qraftacademy.org       / admin123
Facilitator: facilitator@qraftacademy.org / facilitator123
Learner 1:   sarah@example.com            / learner123
Learner 2:   james@example.com            / learner123
Learner 3:   amina@example.com            / learner123
```

### 6. Start Development Server

```powershell
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### 7. Verify Installation

1. Visit [http://localhost:3000](http://localhost:3000)
2. Click "Sign In"
3. Use one of the test credentials
4. You should see the appropriate dashboard based on the user role

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
- Check if MongoDB is running: `Get-Service MongoDB`
- Start MongoDB: `net start MongoDB`
- Verify connection string in `.env`

### Issue: Cloudinary Upload Fails

**Error:** `Invalid signature` or `Upload preset not found`

**Solution:**
- Verify Cloudinary credentials in `.env`
- Ensure upload preset `qraft_academy` exists and is set to "Unsigned"
- Check that all environment variables are properly set

### Issue: NextAuth Error

**Error:** `[next-auth][error][NO_SECRET]`

**Solution:**
- Ensure `NEXTAUTH_SECRET` is set in `.env`
- Restart the development server after changing `.env`

### Issue: Module Not Found

**Error:** `Cannot find module '@/...'`

**Solution:**
- Delete `node_modules` and `.next` folders
- Reinstall dependencies: `npm install`
- Restart dev server

## Development Workflow

### Adding New Users via CSV

1. Generate CSV template:
   ```powershell
   node -e "require('./lib/import-users').generateUserCSVTemplate('./users.csv')"
   ```

2. Fill in user data in `users.csv`

3. Import users:
   ```powershell
   node -e "require('./lib/import-users').importUsersFromCSV('./users.csv')"
   ```

### Adding New Courses via CSV

1. Generate CSV template:
   ```powershell
   node -e "require('./lib/import-courses').generateCourseCSVTemplate('./courses.csv')"
   ```

2. Fill in course data in `courses.csv`

3. Import courses:
   ```powershell
   node -e "require('./lib/import-courses').importCoursesFromCSV('./courses.csv')"
   ```

### Database Management

**View data:**
```powershell
# Using MongoDB Compass (GUI)
# Download from https://www.mongodb.com/products/compass
# Connect to: mongodb://localhost:27017
```

**Clear database:**
```powershell
npm run seed
```
(This clears and re-seeds the database)

## Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Update these for production:
```env
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=different-secret-for-production
NODE_ENV=production
```

## Next Steps

1. **Explore the Platform**
   - Sign in with different roles
   - Browse courses
   - Enroll in a course
   - Track progress

2. **Customize Branding**
   - Update colors in `tailwind.config.js`
   - Add your logo to the landing page
   - Modify text content

3. **Add Your Content**
   - Create new courses via the facilitator dashboard
   - Upload videos to Cloudinary
   - Import users via CSV

4. **Configure Partners**
   - Create partner organizations
   - Set up programs
   - Enroll learners in cohorts

## Getting Help

- **Documentation:** Check the README.md file
- **Issues:** Open an issue on GitHub
- **Email:** support@qraftacademy.org

## Development Tips

- Use MongoDB Compass to visualize your data
- Check browser console for client-side errors
- Check terminal for server-side errors
- Use `npm run lint` to check code quality
- Use `npm run type-check` to verify TypeScript

## Useful Commands

```powershell
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Lint code
npm run type-check       # Check TypeScript

# Database
npm run seed             # Seed database with sample data

# Testing
# (Add test scripts as needed)
```

## Project Structure Overview

```
Edtech/
├── app/              # Next.js pages and API routes
├── models/           # MongoDB schemas
├── lib/              # Utilities (auth, db, cloudinary)
├── components/       # Reusable React components
├── scripts/          # Database seeding scripts
├── types/            # TypeScript type definitions
└── public/           # Static assets
```

---

**You're ready to start building!** 🚀

For more details, check the main README.md file.
