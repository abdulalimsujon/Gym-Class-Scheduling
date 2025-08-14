import mongoose from "mongoose";
import config from "./app/config";
import { Server } from "http";
import app from "./app";
import bcrypt from "bcrypt";
import { UserModel } from "./app/modules/user/user.model";
import { UserRole } from "./app/modules/user/user.interface";
let server: Server;

// Admin seeding function
const seedAdmin = async () => {
  const existingAdmin = await UserModel.findOne({
    email: "admin@example.com",
    isDeleted: false,
  });
  if (existingAdmin) {
    console.log("Admin user already exists. Skipping seeding.");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await UserModel.create({
    name: "Super Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: UserRole.ADMIN,
  });

  console.log("Admin user seeded successfully.");
};

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("MongoDB connected.");

    // Seed admin before starting server
    await seedAdmin();

    server = app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection detected:", reason);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception detected:", error);
  process.exit(1);
});

main();
