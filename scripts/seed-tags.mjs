/**
 * Script to seed initial tags in MongoDB
 * Usage: node scripts/seed-tags.mjs
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function seedTags() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log('🌱 Starting tags seed...');

    await client.connect();
    console.log('📡 Connected to MongoDB');

    const db = client.db(process.env.MONGODB_DB_NAME);
    const tagsCollection = db.collection('news_tags');

    // Check if tags already exist
    const existingCount = await tagsCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} tag(s) already exist. Skipping seed...`);
      await client.close();
      process.exit(0);
    }

    // Initial tags matching hardcoded enum
    const initialTags = [
      {
        name: 'Notícias da indústria',
        slug: 'noticias-da-industria',
        color: '#2e4b89',
        description: 'Notícias relacionadas à indústria farmacêutica',
        order: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Proteção ao Trabalhador',
        slug: 'protecao-ao-trabalhador',
        color: '#16a34a',
        description: 'Direitos e proteção dos trabalhadores',
        order: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Notícias da União',
        slug: 'noticias-da-uniao',
        color: '#dc2626',
        description: 'Notícias do sindicato',
        order: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Membro Spotlight',
        slug: 'membro-spotlight',
        color: '#9333ea',
        description: 'Destaque para membros do sindicato',
        order: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log('📝 Creating initial tags...');
    const result = await tagsCollection.insertMany(initialTags);

    console.log(`✅ ${result.insertedCount} tags created successfully!`);
    initialTags.forEach((tag, index) => {
      console.log(`  ${index + 1}. ${tag.name} (${tag.color})`);
    });

    console.log('\n🎉 Tags seeded successfully!');
    console.log('\n💡 You can now manage tags at /admin/tags');

    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding tags:', error);
    await client.close();
    process.exit(1);
  }
}

seedTags();
