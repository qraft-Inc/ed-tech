import fs from 'fs';
import Papa from 'papaparse';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Profile from '@/models/Profile';
import { UserRole, Gender, LearnerType, AgeRange } from '@/models';

interface UserCSVRow {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: string;
  gender?: string;
  ageRange?: string;
  learnerType?: string;
  country?: string;
  district?: string;
}

/**
 * Import users from CSV file
 * CSV format: email, password, firstName, lastName, phone, role, gender, ageRange, learnerType, country, district
 */
export async function importUsersFromCSV(filePath: string): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[],
  };

  try {
    await connectDB();

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = Papa.parse<UserCSVRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    for (const row of parsed.data) {
      try {
        // Validate required fields
        if (!row.email || !row.password || !row.firstName || !row.lastName) {
          results.errors.push(`Missing required fields for ${row.email || 'unknown'}`);
          results.failed++;
          continue;
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: row.email });
        if (existingUser) {
          results.errors.push(`User ${row.email} already exists`);
          results.failed++;
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(row.password, 12);

        // Create user
        const user = await User.create({
          email: row.email.toLowerCase().trim(),
          password: hashedPassword,
          phone: row.phone,
          role: (row.role as UserRole) || UserRole.LEARNER,
          isActive: true,
          emailVerified: false,
        });

        // Create profile
        await Profile.create({
          userId: user._id,
          firstName: row.firstName.trim(),
          lastName: row.lastName.trim(),
          gender: row.gender as Gender,
          ageRange: row.ageRange as AgeRange,
          learnerType: row.learnerType as LearnerType,
          country: row.country || 'Uganda',
          district: row.district,
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

        results.success++;
      } catch (error: any) {
        results.errors.push(`Error creating user ${row.email}: ${error.message}`);
        results.failed++;
      }
    }
  } catch (error: any) {
    results.errors.push(`File processing error: ${error.message}`);
  }

  return results;
}

/**
 * Generate CSV template for user import
 */
export function generateUserCSVTemplate(outputPath: string): void {
  const headers = [
    'email',
    'password',
    'firstName',
    'lastName',
    'phone',
    'role',
    'gender',
    'ageRange',
    'learnerType',
    'country',
    'district',
  ];

  const exampleData = [
    {
      email: 'learner@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+256700000000',
      role: 'learner',
      gender: 'male',
      ageRange: '25_34',
      learnerType: 'youth',
      country: 'Uganda',
      district: 'Kampala',
    },
  ];

  const csv = Papa.unparse({ fields: headers, data: exampleData });
  fs.writeFileSync(outputPath, csv);
  console.log(`CSV template generated at ${outputPath}`);
}

export default {
  importUsersFromCSV,
  generateUserCSVTemplate,
};
