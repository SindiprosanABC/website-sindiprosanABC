/**
 * Script to seed initial admin user in MongoDB
 * Usage: npx ts-node scripts/seed-admin.ts
 */

import { hashPassword } from '../lib/auth';
import { connectToDatabase } from '../lib/mongodb';

async function seedAdminUser() {
  try {
    console.log('🌱 Starting admin user seed...');

    const email = process.env.ADMIN_EMAIL || 'admin@sindiprosan.com.br';
    const password = process.env.ADMIN_PASSWORD || 'SenhaSegura123!';

    if (!email || !password) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    const adminsCollection = db.collection('admin_users');

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({ email });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', email);
      console.log('Skipping seed...');
      process.exit(0);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await hashPassword(password);

    // Create admin user
    console.log('📝 Creating admin user...');
    const result = await adminsCollection.insertOne({
      email,
      password: hashedPassword,
      name: 'Administrador',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔑 User ID:', result.insertedId);
    console.log('\n🎉 You can now login at /admin/login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdminUser();
