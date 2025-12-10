import { betterAuth } from "better-auth";
import prisma from "./db/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  adapter: prismaAdapter(prisma, { provider: "postgresql" /* add other PrismaConfig options here */ }),
  secret: process.env.BETTER_AUTH_SECRET,
  url: process.env.BETTER_AUTH_URL,
});