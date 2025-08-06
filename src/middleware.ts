import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Temporariamente desabilitado para debug
  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/cart/:path*"],
};
