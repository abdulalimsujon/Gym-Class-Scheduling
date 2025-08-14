/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";
import bcrypt from "bcrypt";
import { UserModel } from "./app/modules/user/user.model";
import { UserRole } from "./app/modules/user/user.interface";

let isConnected = false;

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

const connectDB = async () => {
  if (!isConnected) {
    await mongoose.connect(config.database_url as string);
    isConnected = true;
    console.log("MongoDB connected.");
    await seedAdmin();
  }
};

export default async function handler(req: any, res: any) {
  await connectDB();
  return app(req, res);
}

if (process.env.NODE_ENV !== "production") {
  connectDB().then(() => {
    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  });
}
