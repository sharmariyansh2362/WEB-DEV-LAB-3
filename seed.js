const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Product = require('./src/models/Product');

const sampleProducts = [
  {
    name: 'Study Table',
    sku: 'FURN-TB-812',
    category: 'Furniture',
    price: 3999,
    quantity: 2,
    reorderLevel: 4,
    supplier: 'IKEA India'
  },
  {
    name: 'Gel Pen Pack of 15',
    sku: 'STNY-PN-713',
    category: 'Stationery',
    price: 120,
    quantity: 40,
    reorderLevel: 20,
    supplier: 'Cello Pens'
  },
  {
    name: 'Office Ergonomic Chair',
    sku: 'FURN-CH-104',
    category: 'Furniture',
    price: 5499,
    quantity: 8,
    reorderLevel: 5,
    supplier: 'Featherlite'
  },
  {
    name: 'Wireless Bluetooth Mouse',
    sku: 'ELEC-MS-201',
    category: 'Electronics',
    price: 899,
    quantity: 25,
    reorderLevel: 10,
    supplier: 'Logitech'
  },
  {
    name: 'Mechanical Gaming Keyboard',
    sku: 'ELEC-KB-502',
    category: 'Electronics',
    price: 3499,
    quantity: 15,
    reorderLevel: 5,
    supplier: 'Redragon'
  },
  {
    name: 'USB-C Fast Charging Cable',
    sku: 'ELEC-CB-909',
    category: 'Electronics',
    price: 299,
    quantity: 50,
    reorderLevel: 15,
    supplier: 'Anker'
  },
  {
    name: '27-inch 4K Monitor',
    sku: 'ELEC-MN-707',
    category: 'Electronics',
    price: 24990,
    quantity: 6,
    reorderLevel: 3,
    supplier: 'LG Electronics'
  },
  {
    name: 'Cotton Casual T-Shirt',
    sku: 'APPR-TS-301',
    category: 'Apparel',
    price: 699,
    quantity: 50,
    reorderLevel: 15,
    supplier: 'Raymond'
  },
  {
    name: 'Denim Slim Fit Jeans',
    sku: 'APPR-JN-402',
    category: 'Apparel',
    price: 2099,
    quantity: 28,
    reorderLevel: 10,
    supplier: 'Levi Strauss'
  },
  {
    name: 'Hardcover Ruled Notebook',
    sku: 'STNY-NB-111',
    category: 'Stationery',
    price: 180,
    quantity: 60,
    reorderLevel: 25,
    supplier: 'Classmate'
  },
  {
    name: 'Stapler and Pin Set',
    sku: 'STNY-ST-222',
    category: 'Stationery',
    price: 95,
    quantity: 3,
    reorderLevel: 10,
    supplier: 'Kangaro'
  },
  {
    name: 'Ceramic Coffee Mug',
    sku: 'KTC-MG-601',
    category: 'Kitchenware',
    price: 250,
    quantity: 4,
    reorderLevel: 8,
    supplier: 'Clay Craft'
  }
];

const seedData = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    console.log('Previous products removed.');

    await Product.insertMany(sampleProducts);
    console.log(`Successfully seeded ${sampleProducts.length} sample products!`);

    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
