/**
 * Script to seed initial admin user in MongoDB
 * Usage: node scripts/seed-admin.mjs
 */

import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function seedAdminUser() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log('🌱 Starting admin user seed...');

    const email = process.env.ADMIN_EMAIL || 'admin@sindiprosan.com.br';
    const password = process.env.ADMIN_PASSWORD || 'SenhaSegura123!';

    if (!email || !password) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
    }

    // Connect to MongoDB
    await client.connect();
    console.log('📡 Connected to MongoDB');

    const db = client.db(process.env.MONGODB_DB_NAME);
    const adminsCollection = db.collection('admin_users');

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({ email });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', email);
      console.log('Skipping seed...');
      await client.close();
      process.exit(0);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

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
    console.log('🔑 User ID:', result.insertedId.toString());
    console.log('\n🎉 You can now login at /admin/login');

    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    await client.close();
    process.exit(1);
  }
}

seedAdminUser();
