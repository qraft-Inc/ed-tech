# Qraft Academy - System Architecture

## Overview

Qraft Academy is a full-stack EdTech platform built with modern web technologies, designed for scalability, accessibility, and impact measurement in low-resource environments.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer (Browser)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Learner    │  │ Facilitator  │  │    Admin     │      │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App Router                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Pages     │  │  API Routes  │  │  Middleware  │      │
│  │  (RSC/SSR)   │  │   (REST)     │  │    (Auth)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Auth       │  │   Course     │  │  Analytics   │      │
│  │  Helpers     │  │  Services    │  │   Services   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Access Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Mongoose   │  │  NextAuth    │  │  Cloudinary  │      │
│  │   Models     │  │   Adapter    │  │     SDK      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Storage Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MongoDB    │  │  Cloudinary  │  │   Session    │      │
│  │  (Database)  │  │    (CDN)     │  │   (JWT)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Next.js 14** (App Router, React Server Components)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icons
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - REST API
- **NextAuth.js** - Authentication
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **Zod** - Input validation

### Database
- **MongoDB** - Primary data store
- **Indexes** - Optimized queries for analytics

### Media & Storage
- **Cloudinary** - Video, image, PDF storage
- **Adaptive Streaming** - Multiple video qualities
- **Transformations** - On-the-fly image processing

### DevOps
- **Vercel** (recommended) - Hosting
- **MongoDB Atlas** - Database hosting
- **Git** - Version control

## Data Model

### Core Entities

```
User
├─ Profile (1:1)
├─ Enrollments (1:N)
└─ Results (1:N)

Course
├─ Modules (1:N)
│  └─ Lessons (1:N)
├─ Quizzes (1:N)
│  └─ Questions (1:N)
└─ Enrollments (1:N)

Partner
├─ Programs (1:N)
│  └─ Cohorts (1:N)
└─ Revenue (1:N)

Enrollment
├─ LessonProgress (embedded)
├─ ModuleProgress (embedded)
└─ Certificate (1:1)
```

### Key Relationships

- User → Profile (one-to-one)
- User → Enrollments (one-to-many)
- Course → Modules (one-to-many)
- Module → Lessons (one-to-many)
- Enrollment → Certificate (one-to-one)
- Partner → Programs (one-to-many)
- Program → Cohorts (one-to-many)

## Authentication & Authorization

### Authentication Flow

```
1. User submits credentials
2. NextAuth validates against MongoDB
3. Password verified with bcrypt
4. JWT token issued with user role
5. Session stored in encrypted cookie
6. Subsequent requests validated via JWT
```

### Authorization Model

**Role Hierarchy:**
```
System Admin > Partner Admin > Facilitator > Learner
```

**Permissions Matrix:**

| Action | Learner | Facilitator | Partner Admin | System Admin |
|--------|---------|-------------|---------------|--------------|
| View courses | ✓ | ✓ | ✓ | ✓ |
| Enroll in course | ✓ | ✓ | ✓ | ✓ |
| Create course | ✗ | ✓ | ✓ | ✓ |
| Manage users | ✗ | ✗ | Partner only | ✓ |
| View analytics | Own | Own courses | Partner only | ✓ |
| System config | ✗ | ✗ | ✗ | ✓ |

### Route Protection

```typescript
// Server Components
const user = await requireAuth();
const admin = await requireAdmin();
const partnerAdmin = await requirePartnerAdmin();

// API Routes
if (!user) return Response 401
if (!allowedRoles.includes(user.role)) return Response 403
```

## API Architecture

### REST API Design

**Base URL:** `/api`

**Endpoints:**

```
/auth
  POST /register         - Register new user
  POST /[...nextauth]    - NextAuth endpoints

/courses
  GET  /                 - List courses (query: status, category, level)
  POST /                 - Create course (auth: facilitator+)
  GET  /:id              - Get course details
  PUT  /:id              - Update course (auth: creator/admin)
  DELETE /:id            - Delete course (auth: creator/admin)
  POST /:id/enroll       - Enroll in course (auth: any)
  GET  /:id/enroll       - Get enrollment status
  POST /:id/modules      - Create module (auth: facilitator+)
  GET  /:id/modules      - List modules

/modules
  POST /:moduleId/lessons - Create lesson (auth: facilitator+)

/progress
  POST /                 - Update learning progress

/upload
  POST /signature        - Get Cloudinary upload signature
```

### Request/Response Format

**Standard Success:**
```json
{
  "data": { ... },
  "message": "Success"
}
```

**Standard Error:**
```json
{
  "error": "Error message",
  "details": { ... }
}
```

### Error Handling

- **400** - Bad Request (validation error)
- **401** - Unauthorized (not authenticated)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Internal Server Error

## Database Design

### Indexes

**User Collection:**
```javascript
{ email: 1 } - unique
{ role: 1, isActive: 1 }
{ partnerId: 1, role: 1 }
```

**Course Collection:**
```javascript
{ slug: 1 } - unique
{ status: 1, category: 1 }
{ title: 'text', description: 'text', tags: 'text' }
{ enrollmentCount: -1 }
```

**Enrollment Collection:**
```javascript
{ userId: 1, courseId: 1 } - unique compound
{ status: 1, completedAt: 1 }
{ courseId: 1, status: 1 }
{ progress: 1 }
```

**Profile Collection:**
```javascript
{ userId: 1 } - unique
{ country: 1, district: 1 }
{ gender: 1 }
{ learnerType: 1 }
```

### Aggregation Pipelines

**Analytics queries use MongoDB aggregation:**

```javascript
// Gender distribution
Profile.aggregate([
  { $group: { _id: '$gender', count: { $sum: 1 } } }
])

// Completion rate by course
Enrollment.aggregate([
  { $match: { courseId: courseId } },
  { $group: {
      _id: '$status',
      count: { $sum: 1 }
    }
  }
])

// Average progress
Enrollment.aggregate([
  { $group: {
      _id: null,
      avgProgress: { $avg: '$progress' }
    }
  }
])
```

## Media Management

### Cloudinary Integration

**Upload Flow:**
```
1. Client requests upload signature from API
2. Server generates signed upload parameters
3. Client uploads directly to Cloudinary
4. Cloudinary returns asset details
5. Client saves URL/ID to database
```

**Video Processing:**
- Original uploaded to Cloudinary
- Multiple qualities generated (720p, 480p, 360p, 240p)
- Adaptive streaming URLs provided
- Thumbnails auto-generated

**Low-Bandwidth Support:**
```javascript
qualities: [
  { quality: '240p', bandwidth: 250 }, // Mobile/2G
  { quality: '360p', bandwidth: 500 }, // Mobile/3G
  { quality: '480p', bandwidth: 1000 }, // WiFi
  { quality: '720p', bandwidth: 2500 }  // High-speed
]
```

### CDN Benefits

- Global content delivery
- Automatic format conversion (WebP, AVIF)
- Responsive image sizing
- Video transcoding
- Subtitle support

## Accessibility Architecture

### Client-Side

**Font Size Control:**
```javascript
html.font-large { font-size: 18px }
html.font-extra-large { font-size: 20px }
```

**High Contrast:**
```javascript
html.high-contrast { filter: contrast(1.5) }
```

**Reduced Motion:**
```javascript
html.reduced-motion * {
  animation-duration: 0.01ms !important
}
```

### Server-Side

**Profile preferences stored in database:**
```javascript
accessibilityPreferences: {
  fontSize: 'medium',
  enableCaptions: true,
  enableScreenReader: false,
  highContrast: false,
  reducedMotion: false
}
```

### Mobile-First

- Responsive design (mobile → tablet → desktop)
- Touch-friendly interfaces
- Optimized for slow connections
- Progressive enhancement

## Analytics & Reporting

### Key Metrics Tracked

**User Metrics:**
- Total users (by role)
- Active learners
- New registrations
- User demographics (gender, location, age, type)

**Course Metrics:**
- Total courses (by status)
- Enrollments per course
- Completion rates
- Average progress
- Time spent per course

**Program Metrics:**
- Active programs
- Learners per program
- Program completion rates
- Cost per learner
- Revenue per partner

**Impact Metrics:**
- Certificates issued
- Skills gained
- Employment outcomes (future)
- Learner satisfaction (future)

### Dashboard Aggregations

Real-time calculations using MongoDB aggregations:

```javascript
// Total active learners
Enrollment.countDocuments({ status: 'active' })

// Completion rate
(completedEnrollments / totalEnrollments) * 100

// Average score
Result.aggregate([
  { $group: { _id: null, avgScore: { $avg: '$score' } } }
])

// Gender breakdown
Profile.aggregate([
  { $group: { _id: '$gender', count: { $sum: 1 } } }
])
```

## Security Measures

### Authentication Security

- **Password Hashing:** bcrypt with 12 rounds
- **JWT Tokens:** Signed with secret key
- **Session Management:** Encrypted HTTP-only cookies
- **Token Expiration:** 30-day max age

### API Security

- **CORS:** Configured for specific origins
- **Rate Limiting:** (implement as needed)
- **Input Validation:** Zod schemas
- **SQL Injection:** N/A (NoSQL with Mongoose)
- **XSS Protection:** React auto-escaping

### Data Security

- **Password Storage:** Never stored in plain text
- **Sensitive Data:** Excluded from API responses
- **Audit Logging:** All critical actions logged
- **RBAC:** Role-based access control

### File Upload Security

- **Signed Uploads:** Cloudinary signature validation
- **File Type Restrictions:** Enforced by Cloudinary
- **Size Limits:** 10MB images, 100MB videos
- **Malware Scanning:** Cloudinary automatic

## Scalability

### Horizontal Scaling

**Next.js:** Stateless, scales horizontally on Vercel
**MongoDB:** Replica sets and sharding supported
**Cloudinary:** Global CDN, unlimited scalability

### Database Optimization

- **Indexes:** Optimized for common queries
- **Lean Queries:** Return plain objects, not Mongoose documents
- **Connection Pooling:** maxPoolSize: 10
- **Caching:** (implement Redis as needed)

### Performance

- **React Server Components:** Reduced client bundle
- **Static Generation:** Pages cached where possible
- **API Response Caching:** (implement as needed)
- **Image Optimization:** Cloudinary CDN
- **Code Splitting:** Automatic with Next.js

## Monitoring & Logging

### Application Logs

```javascript
console.log() // Development
console.error() // Errors (always)
console.warn() // Warnings
```

### Audit Logs

All critical actions logged to `AuditLog` collection:
- User logins
- Course creation/updates
- Enrollment changes
- Certificate issuance
- Data exports

### Error Tracking

- Server errors logged to console
- Client errors caught by React Error Boundaries
- (Implement Sentry/LogRocket for production)

## Deployment Architecture

### Recommended Stack

```
┌─────────────────────┐
│   Vercel (Frontend) │
│   - Next.js app     │
│   - API routes      │
│   - Edge functions  │
└─────────────────────┘
          │
          ├─────────────────────────┐
          │                         │
┌─────────────────────┐  ┌─────────────────────┐
│  MongoDB Atlas      │  │   Cloudinary        │
│  - Primary DB       │  │   - Media CDN       │
│  - Backup/replicas  │  │   - Transformations │
└─────────────────────┘  └─────────────────────┘
```

### Environment Configuration

**Development:**
```
- Local MongoDB
- Local Cloudinary test account
- HTTP (no SSL)
```

**Production:**
```
- MongoDB Atlas (M10+ cluster)
- Cloudinary production account
- HTTPS (required)
- Environment variables secured
```

## Future Enhancements

### Phase 2
- Advanced quiz system (essay grading)
- Certificate PDF generation (jsPDF)
- Email notifications (SendGrid/AWS SES)
- SMS notifications (Twilio/Africa's Talking)

### Phase 3
- Mobile app (React Native + Expo)
- Offline mode (local storage sync)
- Live classes (WebRTC/Zoom integration)
- Discussion forums

### Phase 4
- AI recommendations (machine learning)
- Gamification (badges, leaderboards)
- Peer learning (study groups)
- Advanced analytics (ML insights)

---

This architecture is designed to be:
- **Scalable** - Handle thousands of concurrent users
- **Accessible** - Work on low-bandwidth, mobile devices
- **Maintainable** - Clean code, TypeScript, documentation
- **Secure** - Industry-standard security practices
- **Impactful** - Track learner outcomes and measure impact
