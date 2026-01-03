import { NextResponse } from "next/server";

export async function GET() {
  // NextAuth signOut je klientská funkce; serverově nejjednodušší je přesměrovat na built-in signout URL:
  return NextResponse.redirect(
    new URL("/api/auth/signout?callbackUrl=/login", "http://localhost:3000")
  );
}
