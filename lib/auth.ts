import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export type UserRole = "admin" | "editor" | "contributor";
export type UserStatus = "active" | "suspended";

export interface UserProfile {
  id: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  preferences: Record<string, unknown>;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile: UserProfile | null;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email!,
    profile: profile as UserProfile | null,
  };
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth();

  if (!user.profile || !allowedRoles.includes(user.profile.role)) {
    redirect("/");
  }

  return user;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getAuthUser();
  return user?.profile?.role === "admin";
}
