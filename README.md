# Qraft Academy - EdTech Platform

A production-ready EdTech platform for inclusive learning in Uganda, built with Next.js, MongoDB, and Cloudinary.

## 🎯 Overview

Qraft Academy is designed to deliver digital learning at scale, track learning outcomes, support underserved learners (low bandwidth, mobile-first), and support partner-run education programs.

### Key Features

- ✅ **Role-Based Authentication** - Learner, Facilitator, Partner Admin, System Admin
- ✅ **Course Management** - Create courses with modules, lessons, and multimedia content
- ✅ **Progress Tracking** - Resume learning, track completion, and time spent
- ✅ **Assessment System** - Quizzes, pre/post tests, and automated grading
- ✅ **Certification** - Auto-generated certificates with unique IDs
- ✅ **Partner Programs** - Multi-tenant support for partner organizations
- ✅ **Analytics Dashboard** - Track impact, completion rates, and demographics
- ✅ **Accessibility** - Mobile-first, low-bandwidth mode, captions, screen reader support
- ✅ **Media Management** - Cloudinary integration for videos, images, and PDFs
- ✅ **Data Import** - CSV import for users, courses, and content

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for media storage)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Edtech
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/qraft-academy

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. **Seed the database**
```bash
npm run seed
```

5. **Start development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📝 Test Credentials

After seeding, use these credentials:

- **Admin**: admin@qraftacademy.org / admin123
- **Facilitator**: facilitator@qraftacademy.org / facilitator123
- **Learner**: sarah@example.com / learner123

## 📚 Tech Stack

### Core
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **MongoDB** - NoSQL database with Mongoose ODM
- **NextAuth.js** - Authentication and session management

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

### Media & Files
- **Cloudinary** - Media storage and transformation
- **Next-Cloudinary** - Cloudinary integration for Next.js
- **PapaParse** - CSV parsing and generation

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Data Visualization
- **Recharts** - Charts and analytics

## 🗂️ Project Structure

```
Edtech/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── courses/         # Course management
│   │   ├── progress/        # Learning progress
│   │   └── upload/          # File upload
│   ├── auth/                # Auth pages (signin, register)
│   ├── learner/             # Learner dashboard
│   ├── admin/               # Admin dashboard
│   ├── courses/             # Course pages
│   └── dashboard/           # Main dashboard
├── models/                   # MongoDB schemas
│   ├── User.ts
│   ├── Profile.ts
│   ├── Course.ts
│   ├── Module.ts
│   ├── Lesson.ts
│   ├── Enrollment.ts
│   ├── Quiz.ts
│   ├── Certificate.ts
│   ├── Partner.ts
│   └── Program.ts
├── lib/                      # Utilities and helpers
│   ├── db.ts                # Database connection
│   ├── auth.ts              # NextAuth configuration
│   ├── auth-helpers.ts      # Auth utilities
│   ├── cloudinary.ts        # Cloudinary utilities
│   ├── import-users.ts      # User CSV import
│   └── import-courses.ts    # Course CSV import
├── components/              # React components
│   └── CloudinaryUpload.tsx
├── scripts/                 # Utility scripts
│   └── seed.ts             # Database seeding
└── types/                   # TypeScript type definitions
```

## 🎓 User Roles

### Learner
- Browse and enroll in courses
- Track learning progress
- Take quizzes and assessments
- Earn certificates
- View personalized dashboard

### Facilitator
- Create and manage courses
- Create modules and lessons
- Upload course materials
- Monitor learner progress

### Partner Admin
- Manage partner organization
- Create programs and cohorts
- View partner analytics
- Manage enrolled learners

### System Admin
- Full system access
- User management
- Platform-wide analytics
- Partner management
- System configuration

## 📊 Database Schema

The platform uses MongoDB with 16 core collections:

- **User** - Authentication and user accounts
- **Profile** - User profiles with demographics
- **Course** - Course information and metadata
- **Module** - Course modules/sections
- **Lesson** - Individual lessons with content
- **Enrollment** - User-course relationships
- **Quiz** - Assessments and tests
- **Question** - Quiz questions
- **Answer** - Learner answers
- **Result** - Assessment results
- **Certificate** - Issued certificates
- **Partner** - Partner organizations
- **Program** - Partner programs
- **Cohort** - Learning cohorts
- **Revenue** - Financial tracking
- **AuditLog** - System audit trail

## 🎨 Features in Detail

### Course Delivery
- Multi-format lessons (video, text, audio, PDF)
- Low-bandwidth video streaming with Cloudinary
- Resume learning from last position
- Progress tracking per lesson and module
- Mobile-responsive course viewer

### Assessment System
- Multiple question types (MCQ, true/false, essay)
- Pre-tests and post-tests
- Module quizzes
- Automated grading
- Attempt tracking
- Score history

### Accessibility
- Adjustable font sizes (small, medium, large, extra-large)
- Video captions and subtitles
- Screen reader support
- High contrast mode
- Reduced motion option
- Low-bandwidth mode

### Analytics & Impact
- Total learners and active learners
- Completion rates by course/program
- Average assessment scores
- Drop-off point analysis
- Gender and location breakdown
- CSV/PDF export for reports

### Partner Management
- Multi-tenant architecture
- Partner branding (logo, colors)
- Program management
- Cohort enrollment
- Partner-specific dashboards
- License management

## 📦 CSV Import

### Import Users

Create a CSV file with these columns:
```
email,password,firstName,lastName,phone,role,gender,ageRange,learnerType,country,district
```

Generate a template:
```typescript
import { generateUserCSVTemplate } from '@/lib/import-users';
generateUserCSVTemplate('./users-template.csv');
```

Import users:
```typescript
import { importUsersFromCSV } from '@/lib/import-users';
await importUsersFromCSV('./users.csv');
```

### Import Courses

Create a CSV file with these columns:
```
title,description,level,category,duration,instructorEmail,tags,status
```

Generate a template:
```typescript
import { generateCourseCSVTemplate } from '@/lib/import-courses';
generateCourseCSVTemplate('./courses-template.csv');
```

Import courses:
```typescript
import { importCoursesFromCSV } from '@/lib/import-courses';
await importCoursesFromCSV('./courses.csv');
```

## 🔐 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT-based session management
- Role-based access control (RBAC)
- API route protection
- Input validation with Zod
- XSS protection
- CSRF protection
- Secure headers

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Courses
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course
- `GET /api/courses/[id]` - Get course details
- `PUT /api/courses/[id]` - Update course
- `DELETE /api/courses/[id]` - Delete course

### Modules
- `POST /api/courses/[id]/modules` - Create module
- `GET /api/courses/[id]/modules` - List modules

### Lessons
- `POST /api/modules/[moduleId]/lessons` - Create lesson

### Enrollment
- `POST /api/courses/[id]/enroll` - Enroll in course
- `GET /api/courses/[id]/enroll` - Get enrollment status

### Progress
- `POST /api/progress` - Update learning progress

### Upload
- `POST /api/upload/signature` - Get Cloudinary signature

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### MongoDB Atlas

1. Create a cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in environment variables

### Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get cloud name, API key, and API secret
3. Create upload preset named `qraft_academy`
4. Update environment variables

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Core authentication
- ✅ Course management
- ✅ Basic analytics
- ✅ CSV import

### Phase 2
- 🔲 Advanced quiz system
- 🔲 Certificate PDF generation
- 🔲 Email notifications
- 🔲 SMS integration

### Phase 3
- 🔲 Mobile app (React Native)
- 🔲 Offline mode
- 🔲 Live classes
- 🔲 Discussion forums

### Phase 4
- 🔲 AI recommendations
- 🔲 Gamification
- 🔲 Badges and achievements
- 🔲 Peer learning

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built for EdTech fellowships and inclusive education initiatives
- Designed for low-resource environments
- Focus on impact measurement and learner outcomes
- Support for refugee and underserved communities

## 📞 Support

For support, email support@qraftacademy.org or open an issue on GitHub.

---

**Built with ❤️ for inclusive learning in Uganda**
#   e d - t e c h  
 