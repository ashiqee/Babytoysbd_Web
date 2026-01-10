import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db/dbConnect";
import Users from "@/lib/models/users/Users";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Mobile", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) {
          throw new Error("Both identifier and password are required.");
        }

        await dbConnect();

        const identifier = credentials.identifier.trim().toLowerCase();
        const user = await Users.findOne({
          $or: [
            { mobile_no: identifier },
            { email: identifier },
          ],
        });

        if (!user) {
          throw new Error("No user found with this identifier.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          mobile_no: user.mobile_no,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }:{token:any,user:any}) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.mobile_no = user.mobile_no;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }:{session:any,token:any}) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.mobile_no = token.mobile_no as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signup",
    error: "/auth/error",
  },

  // Add these for better CORS handling
  debug: process.env.NODE_ENV === 'development',
};
