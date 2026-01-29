import './register';
import connectDB from '../lib/db';
import bcrypt from 'bcryptjs';
import {
  User,
  Profile,
  Course,
  Module,
  Lesson,
  Partner,
  Program,
  UserRole,
  Gender,
  LearnerType,
  AgeRange,
  CourseStatus,
  CourseLevel,
  LessonType,
  PartnerStatus,
  PartnerType,
  ProgramStatus,
} from '../models';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    await connectDB();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Lesson.deleteMany({});
    await Partner.deleteMany({});
    await Program.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await User.create({
      email: 'admin@qraftacademy.org',
      password: adminPassword,
      role: UserRole.SYSTEM_ADMIN,
      isActive: true,
      emailVerified: true,
    });

    await Profile.create({
      userId: admin._id,
      firstName: 'System',
      lastName: 'Administrator',
      country: 'Uganda',
      district: 'Kampala',
      accessibilityPreferences: {
        fontSize: 'medium',
        enableCaptions: true,
        enableScreenReader: false,
        highContrast: false,
        reducedMotion: false,
      },
      lowBandwidthMode: false,
      language: 'en',
      timezone: 'Africa/Kampala',
    });

    // Create facilitator user
    console.log('👨‍🏫 Creating facilitator user...');
    const facilitatorPassword = await bcrypt.hash('facilitator123', 12);
    const facilitator = await User.create({
      email: 'facilitator@qraftacademy.org',
      password: facilitatorPassword,
      role: UserRole.FACILITATOR,
      isActive: true,
      emailVerified: true,
    });

    await Profile.create({
      userId: facilitator._id,
      firstName: 'Jane',
      lastName: 'Facilitator',
      country: 'Uganda',
      district: 'Kampala',
      accessibilityPreferences: {
        fontSize: 'medium',
        enableCaptions: true,
        enableScreenReader: false,
        highContrast: false,
        reducedMotion: false,
      },
      lowBandwidthMode: false,
      language: 'en',
      timezone: 'Africa/Kampala',
    });

    // Create sample learners
    console.log('🎓 Creating sample learners...');
    const learnerData = [
      {
        email: 'sarah@example.com',
        firstName: 'Sarah',
        lastName: 'Nakato',
        gender: Gender.FEMALE,
        ageRange: AgeRange.AGE_18_24,
        learnerType: LearnerType.YOUTH,
        district: 'Kampala',
      },
      {
        email: 'james@example.com',
        firstName: 'James',
        lastName: 'Okello',
        gender: Gender.MALE,
        ageRange: AgeRange.AGE_25_34,
        learnerType: LearnerType.WORKER,
        district: 'Gulu',
      },
      {
        email: 'amina@example.com',
        firstName: 'Amina',
        lastName: 'Hassan',
        gender: Gender.FEMALE,
        ageRange: AgeRange.AGE_18_24,
        learnerType: LearnerType.REFUGEE,
        district: 'Adjumani',
      },
    ];

    const learnerPassword = await bcrypt.hash('learner123', 12);
    for (const data of learnerData) {
      const user = await User.create({
        email: data.email,
        password: learnerPassword,
        role: UserRole.LEARNER,
        isActive: true,
        emailVerified: true,
      });

      await Profile.create({
        userId: user._id,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        ageRange: data.ageRange,
        learnerType: data.learnerType,
        country: 'Uganda',
        district: data.district,
        accessibilityPreferences: {
          fontSize: 'medium',
          enableCaptions: true,
          enableScreenReader: false,
          highContrast: false,
          reducedMotion: false,
        },
        lowBandwidthMode: true,
        language: 'en',
        timezone: 'Africa/Kampala',
      });
    }

    // Create sample partner
    console.log('🤝 Creating sample partner...');
    const partner = await Partner.create({
      name: 'UNHCR Uganda',
      slug: 'unhcr-uganda',
      type: PartnerType.NGO,
      status: PartnerStatus.ACTIVE,
      description: 'UN Refugee Agency supporting education for refugees in Uganda',
      contactEmail: 'uganda@unhcr.org',
      contactPhone: '+256-000-000-000',
      address: {
        city: 'Kampala',
        country: 'Uganda',
      },
      adminUsers: [],
      licenseType: 'premium',
      maxLearners: 1000,
    });

    // Create sample program
    console.log('📋 Creating sample program...');
    await Program.create({
      partnerId: partner._id,
      name: 'Digital Skills for Refugees',
      slug: 'digital-skills-refugees',
      description: 'Empowering refugees with essential digital skills',
      status: ProgramStatus.ACTIVE,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      targetLearners: 500,
      enrolledLearners: 0,
      completedLearners: 0,
      courses: [],
      facilitators: [facilitator._id],
      budget: 50000,
      costPerLearner: 100,
      tags: ['refugees', 'digital-skills', 'employment'],
    });

    // Create sample courses
    console.log('📚 Creating sample courses...');
    const courseData = [
      {
        title: 'Introduction to Digital Literacy',
        slug: 'intro-digital-literacy',
        description:
          'Learn the fundamentals of using computers, internet, and digital tools for everyday life and work.',
        level: CourseLevel.BEGINNER,
        category: 'Digital Skills',
        tags: ['digital-literacy', 'basics', 'computer-skills'],
        modules: [
          {
            title: 'Getting Started with Computers',
            lessons: [
              {
                title: 'What is a Computer?',
                type: LessonType.TEXT,
                content: 'Learn about computers and their basic components.',
              },
              {
                title: 'Using the Keyboard and Mouse',
                type: LessonType.TEXT,
                content: 'Master the essential input devices.',
              },
            ],
          },
          {
            title: 'Internet Basics',
            lessons: [
              {
                title: 'What is the Internet?',
                type: LessonType.TEXT,
                content: 'Understand how the internet works.',
              },
              {
                title: 'Web Browsing Essentials',
                type: LessonType.TEXT,
                content: 'Learn to navigate the web safely.',
              },
            ],
          },
        ],
      },
      {
        title: 'Basic Entrepreneurship Skills',
        slug: 'basic-entrepreneurship',
        description:
          'Develop essential business skills to start and manage a small enterprise.',
        level: CourseLevel.BEGINNER,
        category: 'Business',
        tags: ['entrepreneurship', 'business', 'startup'],
        modules: [
          {
            title: 'Business Fundamentals',
            lessons: [
              {
                title: 'What is Entrepreneurship?',
                type: LessonType.TEXT,
                content: 'Introduction to entrepreneurial thinking.',
              },
              {
                title: 'Identifying Business Opportunities',
                type: LessonType.TEXT,
                content: 'Learn to spot profitable business ideas.',
              },
            ],
          },
        ],
      },
      {
        title: 'English Communication Skills',
        slug: 'english-communication',
        description:
          'Improve your English language skills for better communication in work and life.',
        level: CourseLevel.BEGINNER,
        category: 'Language',
        tags: ['english', 'communication', 'language'],
        modules: [
          {
            title: 'Basic English Grammar',
            lessons: [
              {
                title: 'Parts of Speech',
                type: LessonType.TEXT,
                content: 'Learn about nouns, verbs, adjectives, and more.',
              },
            ],
          },
        ],
      },
    ];

    for (const courseInfo of courseData) {
      const course = await Course.create({
        title: courseInfo.title,
        slug: courseInfo.slug,
        description: courseInfo.description,
        level: courseInfo.level,
        category: courseInfo.category,
        tags: courseInfo.tags,
        createdBy: facilitator._id,
        instructors: [facilitator._id],
        status: CourseStatus.PUBLISHED,
        modules: [],
        totalLessons: 0,
        totalQuizzes: 0,
        enrollmentCount: 0,
        completionCount: 0,
        isPublic: true,
        certificateEnabled: true,
        passThreshold: 70,
        language: 'en',
      });

      let lessonCount = 0;
      for (const moduleInfo of courseInfo.modules) {
        const module = await Module.create({
          courseId: course._id,
          title: moduleInfo.title,
          order: course.modules.length,
          lessons: [],
          isPublished: true,
        });

        for (const lessonInfo of moduleInfo.lessons) {
          const lesson = await Lesson.create({
            moduleId: module._id,
            title: lessonInfo.title,
            type: lessonInfo.type,
            order: module.lessons.length,
            content: {
              text: lessonInfo.content,
            },
            duration: 15,
            isPublished: true,
            isPreview: false,
            resources: [],
          });

          module.lessons.push(lesson._id);
          lessonCount++;
        }

        await module.save();
        course.modules.push(module._id);
      }

      course.totalLessons = lessonCount;
      await course.save();
    }

    console.log('✅ Seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Admin: admin@qraftacademy.org / admin123');
    console.log('Facilitator: facilitator@qraftacademy.org / facilitator123');
    console.log('Learner: sarah@example.com / learner123');
    console.log('Learner: james@example.com / learner123');
    console.log('Learner: amina@example.com / learner123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
