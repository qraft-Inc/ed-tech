<div align="center">
  <img src="https://res.cloudinary.com/dwa3soopc/image/upload/v1741594460/8_zziqf2.png" alt="Qraft Academy Logo" width="120"/>
  
  # Qraft Academy
  ### Inclusive EdTech Platform for Uganda
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  
  *Empowering underserved communities with quality digital education*
  
  [🚀 Quick Start](#-quick-start) • [📚 Documentation](#-documentation) • [✨ Features](#-features) • [🤝 Contributing](#-contributing)
</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [CSV Import](#-csv-import)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Qraft Academy** is a production-ready EdTech platform designed to deliver inclusive digital learning at scale in Uganda. Built with modern web technologies, it supports underserved learners with features like low-bandwidth mode, mobile-first design, and comprehensive accessibility options.

### 🎯 Mission
- 📚 Deliver quality digital education at scale
- 📊 Track learning outcomes and impact
- 📱 Support low-bandwidth and mobile-first learners
- 🤝 Enable partner-run education programs

---

## ✨ Key Features

<table>
  <tr>
    <td width="50%">
      
### 🔐 Authentication & Access
- Role-based authentication (4 roles)
- Secure JWT sessions
- Password encryption (bcrypt)
- Multi-tenant support

### 📚 Course Management
- Rich multimedia content
- Modular course structure
- Video, audio, PDF support
- Low-bandwidth streaming

    </td>
    <td width="50%">

### 📊 Progress & Analytics
- Real-time progress tracking
- Completion metrics
- Impact dashboards
- Demographic insights

### ✅ Assessment & Certification
- Multiple question types
- Automated grading
- Certificate generation
- Score tracking

    </td>
  </tr>
</table>

### 🌟 Accessibility Features
| Feature | Description |
|---------|-------------|
| 📱 Mobile-First | Optimized for smartphones |
| 🌐 Low-Bandwidth | Adaptive streaming & compression |
| 🔤 Font Scaling | 4 size options (small to XL) |
| 🎬 Captions | Video subtitles & transcripts |
| 🔊 Screen Reader | ARIA labels & semantic HTML |
| 🎨 High Contrast | Accessibility color modes |
| 🎭 Reduced Motion | Animation preferences |

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))
- **Cloudinary Account** ([Sign up](https://cloudinary.com/))

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/qraft-Inc/ed-tech.git
cd ed-tech

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 4. Seed the database
npm run seed

# 5. Start development server
npm run dev
```

🎉 Open [http://localhost:3000](http://localhost:3000)

### 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@qraftacademy.org | admin123 |
| **Facilitator** | facilitator@qraftacademy.org | facilitator123 |
| **Learner** | sarah@example.com | learner123 |

---

## 🛠 Tech Stack

### Core Technologies
```
Next.js 14  •  TypeScript  •  MongoDB  •  NextAuth.js
```

### Frontend
| Library | Purpose |
|---------|---------|
| **Tailwind CSS** | Styling framework |
| **Lucide React** | Icon library |
| **React Hook Form** | Form management |
| **Zod** | Schema validation |
| **Recharts** | Data visualization |

### Backend & Services
| Service | Purpose |
|---------|---------|
| **MongoDB + Mongoose** | Database & ODM |
| **Cloudinary** | Media storage |
| **NextAuth.js** | Authentication |
| **bcrypt.js** | Password hashing |

---

## 📁 Project Structure

```
ed-tech/
│
├── 📂 app/                      # Next.js App Router
│   ├── 📂 api/                  # API Routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── courses/            # Course CRUD operations
│   │   ├── progress/           # Learning progress tracking
│   │   └── upload/             # File upload handlers
│   │
│   ├── 📂 auth/                 # Auth pages (signin/register)
│   ├── 📂 admin/                # Admin dashboard & pages
│   ├── 📂 learner/              # Learner dashboard & pages
│   ├── 📂 facilitator/          # Facilitator pages
│   ├── 📂 partner/              # Partner admin pages
│   └── 📂 courses/              # Public course pages
│
├── 📂 models/                   # Mongoose schemas (16 models)
│   ├── User.ts                 # User authentication
│   ├── Profile.ts              # User profiles
│   ├── Course.ts               # Course metadata
│   ├── Enrollment.ts           # User enrollments
│   ├── Certificate.ts          # Issued certificates
│   └── ...                     # 11 more models
│
├── 📂 components/               # React components
│   ├── Sidebar.tsx             # Dashboard navigation
│   └── CloudinaryUpload.tsx    # Media upload widget
│
├── 📂 lib/                      # Utilities & helpers
│   ├── db.ts                   # MongoDB connection
│   ├── auth.ts                 # NextAuth config
│   ├── cloudinary.ts           # Media utilities
│   ├── import-users.ts         # CSV user import
│   └── import-courses.ts       # CSV course import
│
└── 📂 scripts/                  # CLI scripts
    └── seed.ts                 # Database seeding
```

---

## 👥 User Roles

<table>
  <tr>
    <th>Role</th>
    <th>Permissions & Features</th>
  </tr>
  <tr>
    <td><strong>🎓 Learner</strong></td>
    <td>
      • Browse & enroll in courses<br>
      • Track learning progress<br>
      • Take quizzes & assessments<br>
      • Earn certificates<br>
      • View personalized dashboard
    </td>
  </tr>
  <tr>
    <td><strong>👨‍🏫 Facilitator</strong></td>
    <td>
      • Create & manage courses<br>
      • Build modules & lessons<br>
      • Upload course materials<br>
      • Monitor learner progress<br>
      • View student analytics
    </td>
  </tr>
  <tr>
    <td><strong>🤝 Partner Admin</strong></td>
    <td>
      • Manage partner organization<br>
      • Create programs & cohorts<br>
      • Enroll learners in bulk<br>
      • View partner analytics<br>
      • Track program ROI
    </td>
  </tr>
  <tr>
    <td><strong>⚙️ System Admin</strong></td>
    <td>
      • Full system access<br>
      • User & role management<br>
      • Platform-wide analytics<br>
      • Partner management<br>
      • System configuration
    </td>
  </tr>
</table>

---

## 🗄 Database Schema

The platform uses **16 MongoDB collections** with comprehensive relationships:

```mermaid
graph LR
    A[User] --> B[Profile]
    A --> C[Enrollment]
    D[Course] --> E[Module]
    E --> F[Lesson]
    C --> D
    C --> G[Progress]
    F --> H[Quiz]
    H --> I[Question]
    I --> J[Answer]
    A --> K[Certificate]
    L[Partner] --> M[Program]
    M --> N[Cohort]
```

### Core Collections

| Collection | Purpose | Key Fields |
|------------|---------|-----------|
| **User** | Authentication | email, password, role, isActive |
| **Profile** | Demographics | firstName, gender, location, accessibility |
| **Course** | Course info | title, description, level, status |
| **Module** | Course sections | title, order, duration |
| **Lesson** | Lesson content | type, content, videoUrl, duration |
| **Enrollment** | User-course link | progress, status, completedAt |
| **Quiz** | Assessments | questions, passingScore, attempts |
| **Certificate** | Credentials | certificateId, issuedAt, verifyUrl |
| **Partner** | Organizations | name, type, status, logo |
| **Program** | Training programs | cohorts, startDate, budget |

---

## 🔌 API Reference

### Authentication

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/courses` | List all courses |
| `POST` | `/api/courses` | Create new course |
| `GET` | `/api/courses/[id]` | Get course details |
| `PUT` | `/api/courses/[id]` | Update course |
| `DELETE` | `/api/courses/[id]` | Delete course |

### Enrollment

```http
POST /api/courses/[id]/enroll
Authorization: Bearer <token>

Response:
{
  "enrollmentId": "...",
  "courseId": "...",
  "status": "active"
}
```

### Progress Tracking

```http
POST /api/progress
Content-Type: application/json

{
  "enrollmentId": "...",
  "lessonId": "...",
  "completed": true,
  "timeSpent": 1200
}
```

📖 [Full API Documentation](./docs/API.md)

---

## 📦 CSV Import

### User Import

**Template Generation:**
```typescript
import { generateUserCSVTemplate } from '@/lib/import-users';
generateUserCSVTemplate('./users-template.csv');
```

**CSV Format:**
```csv
email,password,firstName,lastName,phone,role,gender,ageRange,learnerType,country,district
john@example.com,pass123,John,Doe,+256700000000,learner,male,25-34,student,Uganda,Kampala
```

**Import:**
```typescript
import { importUsersFromCSV } from '@/lib/import-users';
await importUsersFromCSV('./users.csv');
```

### Course Import

**CSV Format:**
```csv
title,description,level,category,duration,instructorEmail,tags,status
Web Development,Learn HTML & CSS,beginner,technology,40,instructor@example.com,"web,coding",published
```

**Import:**
```typescript
import { importCoursesFromCSV } from '@/lib/import-courses';
await importCoursesFromCSV('./courses.csv');
```

---

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/qraft-Inc/ed-tech)

**Manual Steps:**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

### MongoDB Atlas Setup

1. Create cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Add to environment variables:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qraft-academy
   ```

### Cloudinary Configuration

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Create upload preset: `qraft_academy`
3. Add credentials:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## 🔒 Security

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | bcrypt with 12 salt rounds |
| **Session Management** | JWT with 30-day expiry |
| **Access Control** | Role-based permissions (RBAC) |
| **Input Validation** | Zod schema validation |
| **API Protection** | Middleware authentication |
| **XSS Prevention** | React's built-in escaping |
| **CSRF Protection** | NextAuth CSRF tokens |

---

## 📈 Roadmap

### ✅ Phase 1 - Foundation (Completed)
- Core authentication system
- Course management & delivery
- Progress tracking
- Basic analytics dashboard
- CSV import functionality

### 🔄 Phase 2 - Enhancement (In Progress)
- [ ] Advanced quiz system with question banks
- [ ] PDF certificate generation
- [ ] Email notifications (enrollment, completion)
- [ ] SMS integration for low-connectivity users

### 🔮 Phase 3 - Expansion (Planned)
- [ ] React Native mobile app
- [ ] Offline mode with sync
- [ ] Live video classes
- [ ] Discussion forums & peer learning

### 🚀 Phase 4 - Innovation (Future)
- [ ] AI-powered course recommendations
- [ ] Gamification (badges, leaderboards)
- [ ] Adaptive learning paths
- [ ] Voice-based content navigation

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- 🌍 Built for **inclusive education** initiatives
- 🎯 Designed for **low-resource environments**
- 📊 Focus on **impact measurement**
- 🤝 Supporting **refugee and underserved communities** in Uganda

---

## 📞 Support & Contact

<div align="center">

**Need help?**

📧 Email: [support@qraftacademy.org](mailto:support@qraftacademy.org)  
🐛 Issues: [GitHub Issues](https://github.com/qraft-Inc/ed-tech/issues)  
💬 Discussions: [GitHub Discussions](https://github.com/qraft-Inc/ed-tech/discussions)

</div>

---

<div align="center">
  
**Built with ❤️ for inclusive learning in Uganda**

[⬆ Back to Top](#qraft-academy)

</div>

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
#   e d - t e c h 
 
 