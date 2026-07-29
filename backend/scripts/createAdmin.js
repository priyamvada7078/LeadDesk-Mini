// Run this script once to create the default admin account:
//   npm run seed
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("../src/config/db");
const Admin = require("../src/models/Admin");
const mongoose = require("mongoose");

const ADMIN_EMAIL = "admin@leaddesk.com";
const ADMIN_PASSWORD = "Admin@123";

const createAdmin = async () => {
  let exitCode = 0;
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("Admin account already exists:", ADMIN_EMAIL);
    } else {
      // Password is hashed automatically by the pre-save hook in Admin model
      await Admin.create({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });

      console.log("Admin account created successfully:");
      console.log(`  Email:    ${ADMIN_EMAIL}`);
      console.log(`  Password: ${ADMIN_PASSWORD}`);
    }
  } catch (error) {
    console.error("Failed to create admin account:", error.message);
    exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit(exitCode);
  }
};

createAdmin();
