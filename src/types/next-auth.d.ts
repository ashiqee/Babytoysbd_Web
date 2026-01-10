import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "admin" | "manager" | "salesman" | "customer";
    };
  }

  interface User {
    role?: string;
  }
}
