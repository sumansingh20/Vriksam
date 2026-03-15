import NextAuth, { type AuthOptions, type DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

async function refreshAccessToken(token: {
  refreshToken?: string;
  [key: string]: unknown;
}) {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to refresh token");
    }

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Invalid credentials");
          }

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            image: data.user.avatar,
            role: data.user.role,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
    newUser: "/register",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(`${BACKEND_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
              avatar: user.image,
              accessToken: account.access_token,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            return false;
          }

          user.id = data.user.id;
          user.role = data.user.role;
          user.accessToken = data.accessToken;
          user.refreshToken = data.refreshToken;

          return true;
        } catch {
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // On initial sign in, attach user data to the JWT
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
      }

      // Return the token if it has not expired
      if (
        token.accessTokenExpires &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }

      // Token has expired, refresh it
      const refreshedToken = await refreshAccessToken(token);
      return {
        ...refreshedToken,
        id: token.id,
        role: token.role,
      };
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allow relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Allow URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },

  events: {
    async signOut() {
      // Optionally notify the backend to invalidate the refresh token
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
