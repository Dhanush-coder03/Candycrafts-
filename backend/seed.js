require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Product = require('./models/Product');
const Category = require('./models/Category');
const ContactInfo = require('./models/ContactInfo');

const { INITIAL_CATEGORIES, INITIAL_PRODUCTS, DEFAULT_CONTACT_INFO } = require('./data/initialData');

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🌱 Seeding Candy Crafts database...');

    // 1. Seed Categories
    await Category.deleteMany();
    await Category.insertMany(INITIAL_CATEGORIES);
    console.log(`✅ Seeded ${INITIAL_CATEGORIES.length} categories.`);

    // 2. Seed Products
    await Product.deleteMany();
    await Product.insertMany(INITIAL_PRODUCTS);
    console.log(`✅ Seeded ${INITIAL_PRODUCTS.length} products.`);

    // 3. Seed Contact Info
    await ContactInfo.deleteMany();
    await ContactInfo.create(DEFAULT_CONTACT_INFO);
    console.log('✅ Seeded atelier contact info (Owner: candycraftssstudio@gmail.com).');

    console.log('🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
