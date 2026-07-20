// Optional dev convenience: creates a demo household so you don't have to
// click through the setup form every time you reset your local database.
// Run with: npm run db:seed

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const existing = await db.household.count();
  if (existing > 0) {
    console.log("A household already exists — skipping seed.");
    return;
  }

  const [parentPin, kidPin] = await Promise.all([bcrypt.hash("1234", 10), bcrypt.hash("1111", 10)]);

  const household = await db.household.create({ data: { name: "The Demo Family" } });

  const parent = await db.profile.create({
    data: {
      householdId: household.id,
      role: "PARENT",
      name: "Parent",
      avatarEmoji: "🧑",
      avatarColor: "#6366f1",
      pinHash: parentPin,
    },
  });

  await db.profile.createMany({
    data: [
      { householdId: household.id, role: "KID", name: "Riley", avatarEmoji: "🦖", avatarColor: "#22c55e", pinHash: kidPin },
      { householdId: household.id, role: "KID", name: "Jordan", avatarEmoji: "🚀", avatarColor: "#f97316", pinHash: kidPin },
    ],
  });

  await db.chore.createMany({
    data: [
      { householdId: household.id, name: "Take out the trash", description: "Both bins, to the curb", valueCents: 200, createdById: parent.id },
      { householdId: household.id, name: "Load the dishwasher", description: "", valueCents: 150, createdById: parent.id },
      { householdId: household.id, name: "Vacuum living room", description: "Under the couch too", valueCents: 350, createdById: parent.id },
    ],
  });

  console.log(`Seeded "${household.name}" — parent PIN 1234, kid PIN 1111.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
